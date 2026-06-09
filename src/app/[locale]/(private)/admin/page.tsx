import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Users, Calendar, FileText, Package, Star, Trophy } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = createClient();

  // Récupérer les stats en parallèle
  const [
    { count: playersCount },
    { count: sessionsCount },
    { count: applicationsCount },
    { count: equipmentCount },
  ] = await Promise.all([
    supabase.from("players").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("training_sessions").select("*", { count: "exact", head: true }).eq("status", "planned"),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "received"),
    supabase.from("equipment").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: t("players"), value: playersCount ?? 0, icon: Users, color: "bg-primary/10 text-primary", href: `/${locale}/admin/players` },
    { label: "Séances planifiées", value: sessionsCount ?? 0, icon: Calendar, color: "bg-blue-500/10 text-blue-600", href: `/${locale}/admin/training` },
    { label: "Candidatures reçues", value: applicationsCount ?? 0, icon: FileText, color: "bg-amber-500/10 text-amber-600", href: `/${locale}/admin/applications` },
    { label: "Références matériel", value: equipmentCount ?? 0, icon: Package, color: "bg-emerald-500/10 text-emerald-600", href: `/${locale}/admin/logistics` },
  ];

  // Dernières candidatures
  const { data: recentApplications } = await supabase
    .from("applications")
    .select("id, first_name, last_name, position, type, created_at, status")
    .order("created_at", { ascending: false })
    .limit(5) as unknown as { data: any[] | null };
  // Prochaines séances
  const { data: upcomingSessions } = await supabase
    .from("training_sessions")
    .select("id, date, time_start, category, theme_fr, theme_en")
    .eq("status", "planned")
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .limit(5) as unknown as { data: any[] | null };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {t("dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenue sur la plateforme GSF Academy
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <a
            key={label}
            href={href}
            className="group rounded-xl border border-border bg-white p-5 hover:border-primary hover:shadow-elegant transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <p className="text-3xl font-display font-bold text-foreground mt-1">
                  {value}
                </p>
              </div>
              <div className={`rounded-xl p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Deux colonnes */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Dernières candidatures */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Dernières candidatures
            </h2>
            <a href={`/${locale}/admin/applications`} className="text-xs text-primary font-semibold hover:underline">
              Voir tout
            </a>
          </div>
          {recentApplications && recentApplications.length > 0 ? (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {app.first_name} {app.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {app.position} · {app.type === "academy" ? "Académie" : "Boot Camp"}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    app.status === "received"
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : app.status === "accepted"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}>
                    {app.status === "received" ? "Reçue" : app.status === "accepted" ? "Acceptée" : "En étude"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">{t("noData")}</p>
          )}
        </div>

        {/* Prochaines séances */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Prochaines séances
            </h2>
            <a href={`/${locale}/admin/training`} className="text-xs text-primary font-semibold hover:underline">
              Voir tout
            </a>
          </div>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-xs font-bold leading-none">
                      {new Date(session.date).getDate()}
                    </span>
                    <span className="text-[10px] font-medium uppercase">
                      {new Date(session.date).toLocaleString(locale === "fr" ? "fr-FR" : "en-GB", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {locale === "fr" ? session.theme_fr : session.theme_en ?? "Séance d'entraînement"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.category.replace("_", "–")} · {session.time_start?.slice(0, 5)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">{t("noData")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
