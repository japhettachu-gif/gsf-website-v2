import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default async function PlayerSchedulePage({
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
    .select("id, first_name, last_name, category")
    .eq("user_id", user.id)
    .single() as unknown as { data: any | null };

  if (!player) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">Aucun profil joueur associé.</p>
      </div>
    );
  }

  // Prochaines séances de la catégorie du joueur
  const today = new Date().toISOString().split("T")[0];
  const { data: sessions } = await supabase
    .from("training_sessions")
    .select("id, date, time_start, time_end, location, theme_fr, theme_en, status, coaches(profiles(display_name))")
    .eq("category", player.category)
    .gte("date", today)
    .eq("status", "planned")
    .order("date")
    .limit(10) as unknown as { data: any[] | null };

  // Présences du joueur
  const sessionIds = sessions?.map((s) => s.id) ?? [];
  const { data: attendances } = sessionIds.length
    ? await supabase
        .from("attendances")
        .select("session_id, status")
        .eq("player_id", player.id)
        .in("session_id", sessionIds)
    : { data: [] };

  const attendanceMap = Object.fromEntries(
    (attendances ?? []).map((a) => [a.session_id, a.status])
  );

  const attendanceIcon = (sessionId: string) => {
    const status = attendanceMap[sessionId];
    if (status === "present") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "absent") return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === "excused") return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return null;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          {loc === "fr" ? "Mon planning" : "My schedule"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {getCategoryLabel(player.category, loc)}
        </p>
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => {
            const theme = loc === "fr" ? session.theme_fr : session.theme_en;
            const coachName = (session.coaches as any)?.profiles?.display_name;

            return (
              <div
                key={session.id}
                className="rounded-xl border border-border bg-white p-5 flex items-center gap-5"
              >
                {/* Date */}
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-lg font-display font-bold leading-none">
                    {new Date(session.date).getDate()}
                  </span>
                  <span className="text-[10px] font-semibold uppercase">
                    {new Date(session.date).toLocaleString(loc === "fr" ? "fr-FR" : "en-GB", { month: "short" })}
                  </span>
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {theme ?? (loc === "fr" ? "Séance d'entraînement" : "Training session")}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {session.time_start?.slice(0, 5)} – {session.time_end?.slice(0, 5)}
                    </span>
                    {session.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {session.location}
                      </span>
                    )}
                    {coachName && (
                      <span className="text-xs text-muted-foreground">
                        Coach : {coachName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Présence */}
                <div className="shrink-0">
                  {attendanceIcon(session.id)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-12 text-center">
          <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {loc === "fr" ? "Aucune séance planifiée pour le moment." : "No sessions scheduled yet."}
          </p>
        </div>
      )}
    </div>
  );
}
