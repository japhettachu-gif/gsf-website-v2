import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PlayerForm } from "@/components/admin/PlayerForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = createClient();

  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single() as unknown as { data: any | null };

  if (!player) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/admin/players`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {player.first_name} {player.last_name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Modifier le profil du joueur
          </p>
        </div>
      </div>
      <PlayerForm mode="edit" player={player} />
    </div>
  );
}
