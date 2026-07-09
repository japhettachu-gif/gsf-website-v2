export const runtime = 'edge';

import { getTranslations } from "next-intl/server";
import { PlayerForm } from "@/components/admin/PlayerForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewPlayerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

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
            Nouveau joueur
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ajouter un joueur à l'académie
          </p>
        </div>
      </div>
      <PlayerForm mode="create" />
    </div>
  );
}
