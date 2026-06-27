import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageLayout, Section } from "@/components/gsf/Layout";
import { PlayerAvatar } from "@/components/gsf/PartnerLogo";
import { getCategoryLabel, getPositionLabel, formatDate, getPlayerAge } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Ruler, Weight, Footprints } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const supabase = createClient();
  const { data } = await supabase
    .from("players")
    .select("first_name, last_name, position, category")
    .eq("id", id)
    .single() as unknown as { data: any | null };

  if (!data) return { title: "Joueur — GSF" };
  return {
    title: `${data.first_name} ${data.last_name} — Genius Soccer Foundation`,
    description: `${data.first_name} ${data.last_name}, ${getPositionLabel(data.position, locale as "fr" | "en")} — ${getCategoryLabel(data.category, locale as "fr" | "en")}`,
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "players" });
  const supabase = createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single() as unknown as { data: any | null };

  if (!player) notFound();

  const loc = locale as "fr" | "en";
  const stats = [
    { label: t("position"), value: getPositionLabel(player.position, loc), icon: Footprints },
    { label: t("bornIn"), value: `${getPlayerAge(player.birth_date)} ans`, icon: Calendar },
    ...(player.height_cm ? [{ label: t("height"), value: `${player.height_cm} cm`, icon: Ruler }] : []),
    ...(player.weight_kg ? [{ label: t("weight"), value: `${player.weight_kg} kg`, icon: Weight }] : []),
  ];

  return (
    <PageLayout>
      <Section>
        {/* Retour */}
        <Link
          href={`/${locale}/players`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>

        <div className="grid md:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="flex justify-center mb-4">
                <PlayerAvatar
                  name={`${player.first_name} ${player.last_name}`}
                  photo={player.photo_url}
                  size="xl"
                />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {player.first_name} {player.last_name}
              </h1>
              <p className="text-primary font-semibold text-sm mt-1">
                {getCategoryLabel(player.category, loc)}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                <MapPin className="h-3.5 w-3.5" />
                {player.city}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {label}
                  </div>
                  <p className="font-bold text-foreground text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Pied fort */}
            {player.strong_foot && (
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">{t("foot")}</p>
                <p className="font-bold text-foreground capitalize">
                  {player.strong_foot === "right"
                    ? loc === "fr" ? "Droit" : "Right"
                    : player.strong_foot === "left"
                    ? loc === "fr" ? "Gauche" : "Left"
                    : loc === "fr" ? "Ambidextre" : "Both"}
                </p>
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Catégorie badge */}
            <div>
              <span className="inline-block text-xs uppercase tracking-widest text-primary font-bold border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-full mb-4">
                {getCategoryLabel(player.category, loc)}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                {player.first_name} {player.last_name}
              </h2>
              <p className="text-lg text-muted-foreground mt-1">
                {getPositionLabel(player.position, loc)}
              </p>
            </div>

            {/* Biographie */}
            {(loc === "fr" ? player.bio_fr : player.bio_en) && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="h-1 w-5 bg-primary rounded-full inline-block" />
                  {t("bio")}
                </h3>
                <p className="text-muted-foreground font-serif leading-relaxed">
                  {loc === "fr" ? player.bio_fr : player.bio_en}
                </p>
              </div>
            )}

            {/* Nationalité */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="h-1 w-5 bg-primary rounded-full inline-block" />
                {loc === "fr" ? "Informations" : "Details"}
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {loc === "fr" ? "Nationalité" : "Nationality"}
                  </dt>
                  <dd className="font-semibold text-foreground mt-1">{player.nationality}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {loc === "fr" ? "Ville" : "City"}
                  </dt>
                  <dd className="font-semibold text-foreground mt-1">{player.city}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {loc === "fr" ? "Date de naissance" : "Date of birth"}
                  </dt>
                  <dd className="font-semibold text-foreground mt-1">
                    {formatDate(player.birth_date, loc)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {loc === "fr" ? "Statut" : "Status"}
                  </dt>
                  <dd className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      {loc === "fr" ? "Actif" : "Active"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
