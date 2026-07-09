export const runtime = 'edge';

import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { PlayerAvatar } from "@/components/gsf/PartnerLogo";
import { getCategoryLabel, getPositionLabel, formatDate, getPlayerAge } from "@/lib/utils";
import { MapPin, Calendar, Ruler, Weight } from "lucide-react";

export default async function PlayerProfilePage({
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
    .select("*")
    .eq("user_id", user.id)
    .single() as unknown as { data: any | null };

  if (!player) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">
          Aucun profil joueur associé à ce compte.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">
        Mon profil
      </h1>

      {/* Carte principale */}
      <div className="rounded-2xl border border-border bg-white p-8">
        <div className="flex items-start gap-6">
          <PlayerAvatar
            name={`${player.first_name} ${player.last_name}`}
            photo={player.photo_url}
            size="xl"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {player.first_name} {player.last_name}
            </h2>
            <p className="text-primary font-semibold mt-1">
              {getCategoryLabel(player.category, loc)}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">
              {getPositionLabel(player.position, loc)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
              <MapPin className="h-3.5 w-3.5" />
              {player.city}, {player.nationality}
            </div>
          </div>
        </div>

        {/* Stats physiques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: loc === "fr" ? "Âge" : "Age", value: `${getPlayerAge(player.birth_date)} ans`, icon: Calendar },
            { label: loc === "fr" ? "Poste" : "Position", value: player.position, icon: MapPin },
            ...(player.height_cm ? [{ label: loc === "fr" ? "Taille" : "Height", value: `${player.height_cm} cm`, icon: Ruler }] : []),
            ...(player.weight_kg ? [{ label: loc === "fr" ? "Poids" : "Weight", value: `${player.weight_kg} kg`, icon: Weight }] : []),
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
              <p className="font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Biographie */}
      {(loc === "fr" ? player.bio_fr : player.bio_en) && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="font-display font-bold text-foreground mb-3">
            {loc === "fr" ? "Biographie" : "Biography"}
          </h3>
          <p className="text-muted-foreground font-serif leading-relaxed">
            {loc === "fr" ? player.bio_fr : player.bio_en}
          </p>
        </div>
      )}

      {/* Pied fort */}
      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="font-display font-bold text-foreground mb-4">
          {loc === "fr" ? "Informations complémentaires" : "Additional info"}
        </h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {loc === "fr" ? "Pied fort" : "Strong foot"}
            </dt>
            <dd className="font-semibold text-foreground mt-1 capitalize">
              {player.strong_foot === "right" ? (loc === "fr" ? "Droit" : "Right")
                : player.strong_foot === "left" ? (loc === "fr" ? "Gauche" : "Left")
                : loc === "fr" ? "Ambidextre" : "Both"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              {loc === "fr" ? "Date de naissance" : "Date of birth"}
            </dt>
            <dd className="font-semibold text-foreground mt-1">
              {formatDate(player.birth_date, loc)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
