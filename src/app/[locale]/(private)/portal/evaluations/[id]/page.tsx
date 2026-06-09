import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import type { Rating, EvaluationPillar } from "@/types";

const RATING_CONFIG: Record<Rating, { label: Record<string, string>; color: string; bg: string }> = {
  developing:   { label: { fr: "En progression", en: "Developing" },   color: "text-red-600",    bg: "bg-red-50 border-red-200" },
  satisfactory: { label: { fr: "Satisfaisant",   en: "Satisfactory" }, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  good:         { label: { fr: "Bien",            en: "Good" },         color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  excellent:    { label: { fr: "Excellent",       en: "Excellent" },    color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
};

const PILLAR_LABELS: Record<EvaluationPillar, Record<string, string>> = {
  physical:  { fr: "🏃 Physique",     en: "🏃 Physical" },
  mental:    { fr: "🧠 Mental",       en: "🧠 Mental" },
  behaviour: { fr: "🤝 Comportement", en: "🤝 Behaviour" },
  academic:  { fr: "🎓 Académique",   en: "🎓 Academic" },
  technical: { fr: "⚽ Technique",    en: "⚽ Technical" },
  tactical:  { fr: "🧩 Tactique",     en: "🧩 Tactical" },
};

const PILLAR_ORDER: EvaluationPillar[] = ["physical", "mental", "behaviour", "academic", "technical", "tactical"];

export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = createClient();
  const loc = locale as "fr" | "en";

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Récupérer le joueur lié
  const { data: player } = await supabase
    .from("players")
    .select("id, first_name, last_name, position")
    .eq("user_id", user.id)
    .single();

  if (!player) redirect(`/${locale}/portal/evaluations`);

  // Récupérer le bulletin
  const { data: ev } = await supabase
    .from("player_evaluations")
    .select("*, coaches(user_id, role_fr, role_en, profiles(display_name))")
    .eq("id", id)
    .eq("player_id", player.id)
    .eq("status", "published")
    .single();

  if (!ev) notFound();

  // Récupérer les scores avec critères
  const { data: scores } = await supabase
    .from("evaluation_scores")
    .select("rating, comment, evaluation_criteria(pillar, name_fr, name_en, sort_order, position_specific)")
    .eq("evaluation_id", id)
    .order("evaluation_criteria(sort_order)");

  // Grouper par pilier
  const byPillar = (scores ?? []).reduce<Record<string, typeof scores>>((acc, score) => {
    const pillar = (score.evaluation_criteria as any)?.pillar ?? "physical";
    if (!acc[pillar]) acc[pillar] = [];
    acc[pillar]!.push(score);
    return acc;
  }, {});

  const typeLabel: Record<string, Record<string, string>> = {
    weekly:   { fr: "Bulletin Hebdomadaire", en: "Weekly Report" },
    monthly:  { fr: "Bulletin Mensuel",      en: "Monthly Report" },
    semester: { fr: "Bulletin Semestriel",   en: "Semester Report" },
  };

  const coachName = (ev.coaches as any)?.profiles?.display_name ?? "—";
  const coachRole = loc === "fr"
    ? (ev.coaches as any)?.role_fr
    : (ev.coaches as any)?.role_en;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Retour */}
      <Link
        href={`/${locale}/portal/evaluations`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {loc === "fr" ? "Mes bulletins" : "My reports"}
      </Link>

      {/* En-tête bulletin */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-1">
              {typeLabel[ev.type]?.[loc]}
            </p>
            <h1 className="text-xl font-display font-bold text-foreground">
              {player.first_name} {player.last_name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(ev.period_start, loc)} → {formatDate(ev.period_end, loc)}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{coachName}</p>
            <p>{coachRole}</p>
            {ev.published_at && (
              <p className="mt-1">{loc === "fr" ? "Publié le" : "Published"} {formatDate(ev.published_at, loc)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Scores par pilier */}
      {PILLAR_ORDER.filter((p) => byPillar[p]?.length).map((pillar) => (
        <div key={pillar} className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h2 className="font-display font-bold text-foreground">
              {PILLAR_LABELS[pillar][loc]}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {byPillar[pillar]!.map((score, i) => {
              const criteria = score.evaluation_criteria as any;
              const ratingCfg = RATING_CONFIG[score.rating as Rating];
              return (
                <div key={i} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-semibold text-foreground text-sm">
                      {loc === "fr" ? criteria?.name_fr : criteria?.name_en}
                    </p>
                    <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${ratingCfg.bg} ${ratingCfg.color}`}>
                      {ratingCfg.label[loc]}
                    </span>
                  </div>
                  {score.comment && (
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                      {score.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Commentaire général */}
      {(loc === "fr" ? ev.general_comment_fr : ev.general_comment_en) && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-gold" />
            {loc === "fr" ? "Commentaire général" : "General comment"}
          </h2>
          <p className="text-foreground font-serif leading-relaxed">
            {loc === "fr" ? ev.general_comment_fr : ev.general_comment_en}
          </p>
        </div>
      )}

      {/* Objectifs */}
      {ev.objectives_next_period && (
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6">
          <h2 className="font-display font-bold text-foreground mb-3">
            {loc === "fr" ? "Objectifs prochaine période" : "Next period objectives"}
          </h2>
          <p className="text-foreground font-serif leading-relaxed">
            {ev.objectives_next_period}
          </p>
        </div>
      )}
    </div>
  );
}
