export const runtime = 'edge';

import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { PageLayout, PageHero, Section } from "@/components/gsf/Layout";
import { PlayersGrid } from "@/components/gsf/PlayersGrid";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "players" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function PlayersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "players" });
  const supabase = createClient();

  const { data: players } = await supabase
    .from("players")
    .select("id, first_name, last_name, category, position, photo_url, city, birth_date, status")
    .eq("status", "active")
    .order("last_name") as unknown as { data: any[] | null };

  return (
    <PageLayout>
      <PageHero
        eyebrow="GSF"
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Section>
        <PlayersGrid players={players ?? []} locale={locale} />
      </Section>
    </PageLayout>
  );
}
