import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDateShort } from "@/lib/utils";
import { RatingBadge } from "@/components/gsf/Cards";
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Rating } from "@/types";

export default async function PlayerEvaluationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createClient();
  const loc = locale as "fr" | "en";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: player } = await supabase
    .from("players")
    .select("id, first_name, last_name, position")
    .eq("user_id", user.id)
    .single();

  if (!player) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">Aucun profil joueur associé.</p>
      </div>
    );
  }

  const { data: evaluations } = await supabase
    .from("player_evaluations")
    .select("id, type, period_start, period_end, status, published_at, general_comment_fr, general_comment_en")
    .eq("player_id", player.id)
    .eq("status", "published")
    .order("period_end", { ascending: false });

  const typeLabel = (type: string) => {
    const map: Record<string, Record<string, string>> = {
      weekly: { fr: "Hebdomadaire", en: "Weekly" },
      monthly: { fr: "Mensuel", en: "Monthly" },
      semester: { fr: "Semestriel", en: "Semester" },
    };
    return map[type]?.[loc] ?? type;
  };

  const typeColor = (type: string) => {
    if (type === "semester") return "bg-gold/10 text-amber-700 border-gold/30";
    if (type === "monthly") return "bg-primary/10 text-primary border-primary/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Star className="h-6 w-6 text-gold" />
          {loc === "fr" ? "Mes bulletins" : "My reports"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {player.first_name} {player.last_name}
        </p>
      </div>

      {evaluations && evaluations.length > 0 ? (
        <div className="space-y-3">
          {evaluations.map((ev) => (
            <Link
              key={ev.id}
              href={`/${locale}/portal/evaluations/${ev.id}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-white p-5 hover:border-primary hover:shadow-elegant transition-all"
            >
              {/* Type badge */}
              <div className={`shrink-0 rounded-xl border px-3 py-2 text-center min-w-[80px] ${typeColor(ev.type)}`}>
                <p className="text-xs font-bold uppercase tracking-wider">{typeLabel(ev.type)}</p>
              </div>

              {/* Période */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">
                  {formatDateShort(ev.period_start, loc)} → {formatDateShort(ev.period_end, loc)}
                </p>
                {(loc === "fr" ? ev.general_comment_fr : ev.general_comment_en) && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {loc === "fr" ? ev.general_comment_fr : ev.general_comment_en}
                  </p>
                )}
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {loc === "fr" ? "Aucun bulletin disponible pour l'instant." : "No reports available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
