import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { PageLayout, Section, SectionHeader } from "@/components/gsf/Layout";
import { StatBlock, NewsCard, ProgrammeCard } from "@/components/gsf/Cards";
import { PartnerLogo } from "@/components/gsf/PartnerLogo";
import Link from "next/link";
import { ArrowRight, Users, Calendar, Trophy, Handshake } from "lucide-react";
import type { Metadata } from "next";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1920&q=80";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: "Genius Soccer Foundation — Académie de football à Douala",
    description: t("heroSubtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const supabase = await createClient();

  // Données depuis Supabase
  const [
    { data: newsArticles },
    { data: partners },
    { count: playersCount },
    { count: partnersCount },
  ] = await Promise.all([
    supabase
      .from("news_articles")
      .select("id, slug, title_fr, title_en, excerpt_fr, excerpt_en, cover_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("partners")
      .select("id, name, logo_url, tier")
      .eq("active", true)
      .order("sort_order")
      .limit(10),
    supabase.from("players").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("partners").select("*", { count: "exact", head: true }).eq("active", true),
  ]);

  const programmes = [
    { key: "u10", icon: Users },
    { key: "u13", icon: Calendar },
    { key: "u16", icon: Trophy },
  ] as const;

  const stats = [
    { value: 12, suffix: "+", label: t("home.stats.years") },
    { value: playersCount ?? 600, suffix: "+", label: t("home.stats.players") },
    { value: 3, suffix: "", label: t("home.stats.categories") },
    { value: partnersCount ?? 10, suffix: "+", label: t("home.stats.partners") },
  ];

  return (
    <PageLayout>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden
        />
        <div className="absolute inset-0 gsf-hero-overlay" aria-hidden />

        <div className="container-gsf relative py-24 md:py-32 max-w-3xl animate-fade-up">
          <p className="inline-block text-xs uppercase tracking-[0.25em] text-gold font-bold border border-gold/40 px-3 py-1.5 rounded-full mb-6">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight whitespace-pre-line">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-6 text-lg text-white/75 max-w-2xl font-serif leading-relaxed">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/join`}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark transition-colors px-6 py-3.5 rounded-xl font-bold text-white shadow-elegant"
            >
              {t("home.heroCta")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/programmes`}
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 transition-colors px-6 py-3.5 rounded-xl font-semibold"
            >
              {t("home.heroCtaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <Section bg="muted" size="sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <StatBlock key={i} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </Section>

      {/* ── PROGRAMMES ────────────────────────────────────────────────────── */}
      <Section>
        <SectionHeader
          eyebrow={t("nav.programmes")}
          title={t("home.programmesTitle")}
          subtitle={t("home.programmesSubtitle")}
          action={
            <Link
              href={`/${locale}/programmes`}
              className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all text-sm"
            >
              {t("home.programmesCta")} <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid md:grid-cols-3 gap-6">
          {programmes.map(({ key, icon: Icon }) => (
            <ProgrammeCard
              key={key}
              icon={Icon}
              title={t(`programmes.categories.${key}Title` as any)}
              description={t(`programmes.categories.${key}Desc` as any)}
              to={`/${locale}/programmes`}
            />
          ))}
        </div>
      </Section>

      {/* ── NEWS ──────────────────────────────────────────────────────────── */}
      <Section bg="muted">
        <SectionHeader
          eyebrow={t("nav.news")}
          title={t("home.newsTitle")}
          action={
            <Link
              href={`/${locale}/media`}
              className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all text-sm"
            >
              {t("home.newsCta")} <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {newsArticles && newsArticles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <NewsCard
                key={article.id}
                slug={article.slug}
                locale={locale}
                cover={article.cover_url ?? undefined}
                date={article.published_at ?? ""}
                title={locale === "fr" ? article.title_fr : article.title_en}
                excerpt={locale === "fr" ? article.excerpt_fr : article.excerpt_en}
              />
            ))}
          </div>
        ) : (
          /* Fallback si pas encore d'articles */
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                slug: "boot-camp-2024",
                title_fr: "Boot Camp 2024 : trois semaines d'intensité",
                title_en: "Boot Camp 2024: three weeks of intensity",
                excerpt_fr: "Retour sur l'édition 2024 qui a rassemblé 80 jeunes talents.",
                excerpt_en: "Looking back at the 2024 edition that gathered 80 young talents.",
                published_at: "2024-08-15",
                cover_url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=70",
              },
              {
                slug: "partenariat-europe",
                title_fr: "Nouveau partenariat avec un club européen",
                title_en: "New partnership with a European club",
                excerpt_fr: "GSF officialise une convention de formation avec un club de Ligue 1.",
                excerpt_en: "GSF signs a development agreement with a Ligue 1 club.",
                published_at: "2024-06-02",
                cover_url: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=70",
              },
              {
                slug: "tournoi-douala",
                title_fr: "Nos U15 remportent le tournoi de Douala",
                title_en: "Our U15s win the Douala tournament",
                excerpt_fr: "Une finale maîtrisée pour décrocher le titre régional.",
                excerpt_en: "A controlled final to claim the regional title.",
                published_at: "2024-04-20",
                cover_url: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=70",
              },
            ].map((article) => (
              <NewsCard
                key={article.slug}
                slug={article.slug}
                locale={locale}
                cover={article.cover_url}
                date={article.published_at}
                title={locale === "fr" ? article.title_fr : article.title_en}
                excerpt={locale === "fr" ? article.excerpt_fr : article.excerpt_en}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── PARTNERS ──────────────────────────────────────────────────────── */}
      <Section>
        <h2 className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 flex items-center justify-center gap-2 font-bold">
          <Handshake className="h-4 w-4" /> {t("home.partnersTitle")}
        </h2>
        {partners && partners.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {partners.map((p) => (
              <PartnerLogo key={p.id} name={p.name} logo={p.logo_url} />
            ))}
          </div>
        ) : (
          /* Fallback */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {["MTN Cameroun", "Orange", "Total Énergies", "FECAFOOT", "Mairie de Douala"].map((name) => (
              <PartnerLogo key={name} name={name} />
            ))}
          </div>
        )}
      </Section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1A0F] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden
        />
        <div className="container-gsf relative py-20 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold">{t("home.ctaTitle")}</h2>
          <p className="mt-4 text-white/70 font-serif text-lg">{t("home.ctaText")}</p>
          <Link
            href={`/${locale}/join`}
            className="mt-8 inline-flex items-center gap-2 bg-gold hover:bg-gold-light transition-colors px-8 py-4 rounded-xl font-bold text-[#0D0D0D] shadow-gold"
          >
            {t("home.ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
