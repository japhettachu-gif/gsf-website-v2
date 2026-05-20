import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ─── StatBlock ────────────────────────────────────────────────────────────────
interface StatBlockProps {
  value: number;
  suffix?: string;
  label: string;
}

export function StatBlock({ value, suffix = "", label }: StatBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-4xl md:text-5xl font-display font-bold text-foreground tabular-nums">
        {value}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

// ─── ProgrammeCard ────────────────────────────────────────────────────────────
interface ProgrammeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
}

export function ProgrammeCard({ icon: Icon, title, description, to }: ProgrammeCardProps) {
  const inner = (
    <div className="group rounded-xl border border-border bg-card p-7 hover:border-primary hover:shadow-elegant transition-all h-full flex flex-col">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-serif leading-relaxed flex-1">
        {description}
      </p>
      {to && (
        <div className="mt-5 flex items-center gap-1 text-primary text-sm font-semibold">
          <span>En savoir plus</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );

  if (to) return <Link href={to} className="block h-full">{inner}</Link>;
  return inner;
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────
interface NewsCardProps {
  slug: string;
  locale: string;
  cover?: string;
  date: string;
  title: string;
  excerpt: string;
}

export function NewsCard({ slug, locale, cover, date, title, excerpt }: NewsCardProps) {
  const formatted = new Date(date).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  return (
    <Link
      href={`/${locale}/media/news/${slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card hover:shadow-elegant hover:border-primary transition-all"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-gold/10" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{formatted}</p>
        <h3 className="font-display font-semibold leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-serif leading-relaxed line-clamp-3 flex-1">
          {excerpt}
        </p>
        <div className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-semibold">
          {locale === "fr" ? "Lire la suite" : "Read more"}
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

// ─── MatchRow ─────────────────────────────────────────────────────────────────
interface MatchRowProps {
  date: string;
  home: string;
  away: string;
  competition: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: "upcoming" | "played" | "postponed" | "cancelled";
  locale: string;
  vsLabel?: string;
}

export function MatchRow({
  date, home, away, competition,
  homeScore, awayScore, status, locale, vsLabel = "vs",
}: MatchRowProps) {
  const fmt = new Date(date).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-GB",
    { day: "2-digit", month: "short" }
  );

  return (
    <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <p className="text-xs text-muted-foreground w-16 shrink-0 font-medium">{fmt}</p>
      <p className="font-semibold text-sm">
        {home}{" "}
        {status === "played" ? (
          <span className="mx-2 text-primary font-bold">
            {homeScore} – {awayScore}
          </span>
        ) : (
          <span className="mx-2 text-muted-foreground text-xs">{vsLabel}</span>
        )}
        {away}
      </p>
      <p className={cn(
        "text-xs uppercase tracking-wider font-bold shrink-0",
        status === "upcoming" ? "text-primary" : "text-muted-foreground"
      )}>
        {competition}
      </p>
    </div>
  );
}

// ─── RatingBadge ──────────────────────────────────────────────────────────────
import type { Rating } from "@/types";
import { getRatingLabel, getRatingColor } from "@/lib/utils";

interface RatingBadgeProps {
  rating: Rating;
  locale?: "fr" | "en";
}

export function RatingBadge({ rating, locale = "fr" }: RatingBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      getRatingColor(rating)
    )}>
      {getRatingLabel(rating, locale)}
    </span>
  );
}
