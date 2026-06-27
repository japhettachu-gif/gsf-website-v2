import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { getCategoryLabel, getPositionLabel } from "@/lib/utils";
import { PlayerAvatar } from "@/components/gsf/PartnerLogo";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";

export default async function AdminPlayersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; position?: string; status?: string }>;
}) {
  const { locale } = await params;
  const { q, category, position, status } = await searchParams;
  const t = await getTranslations({ locale, namespace: "admin" });
  const supabase = createClient();

  let query = supabase
    .from("players")
    .select("id, first_name, last_name, category, position, photo_url, city, status, birth_date")
    .order("last_name");

  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
  if (category) query = query.eq("category", category);
  if (status) query = query.eq("status", status);
  else query = query.eq("status", "active");
  const { data: players, count } = await query as unknown as { data: any[] | null, count: number | null };

  const loc = locale as "fr" | "en";

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">{t("players")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {players?.length ?? 0} joueur{(players?.length ?? 0) > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/players/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-elegant hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("newPlayer")}
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-white p-4">
        {/* Recherche */}
        <form className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q}
              placeholder={t("search")}
              className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
            />
          </div>
        </form>

        {/* Filtre catégorie */}
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
          onChange={(e) => {
            const url = new URL(window.location.href);
            if (e.target.value) url.searchParams.set("category", e.target.value);
            else url.searchParams.delete("category");
            window.location.href = url.toString();
          }}
        >
          <option value="">Toutes catégories</option>
          <option value="U10_U12">U10–U12</option>
          <option value="U13_U15">U13–U15</option>
          <option value="U16_U18">U16–U18</option>
        </select>

        {/* Filtre poste */}
        <select
          name="position"
          defaultValue={position ?? ""}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
        >
          <option value="">Tous postes</option>
          <option value="GK">GK</option>
          <option value="DEF">DEF</option>
          <option value="MID">MID</option>
          <option value="FWD">FWD</option>
        </select>

        {/* Filtre statut */}
        <select
          name="status"
          defaultValue={status ?? "active"}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25"
        >
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
          <option value="on_loan">Prêtés</option>
          <option value="alumni">Alumni</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joueur</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Catégorie</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Poste</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Ville</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Statut</th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players && players.length > 0 ? (
              players.map((player) => (
                <tr key={player.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <PlayerAvatar
                        name={`${player.first_name} ${player.last_name}`}
                        photo={player.photo_url}
                        size="sm"
                      />
                      <div>
                        <p className="font-semibold text-foreground">
                          {player.first_name} {player.last_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold text-primary bg-primary/8 rounded-full px-2.5 py-1">
                      {player.category.replace("_", "–")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground rounded px-2 py-0.5">
                      {player.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {player.city}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      player.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : player.status === "on_loan"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {player.status === "active" ? "Actif"
                        : player.status === "inactive" ? "Inactif"
                        : player.status === "on_loan" ? "Prêté"
                        : "Alumni"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/players/${player.id}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                        target="_blank"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/${locale}/admin/players/${player.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Modifier
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {t("noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
