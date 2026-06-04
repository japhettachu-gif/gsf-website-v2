"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { cn, getCategoryLabel, getPositionLabel, getPlayerAge } from "@/lib/utils";
import { PlayerAvatar } from "./PartnerLogo";
import type { Category, Position } from "@/types";

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  category: Category;
  position: Position;
  photo_url?: string | null;
  city: string;
  birth_date: string;
  status: string;
}

interface PlayersGridProps {
  players: Player[];
  locale: string;
}

const CATEGORIES: (Category | "all")[] = ["all", "U10_U12", "U13_U15", "U16_U18"];
const POSITIONS: (Position | "all")[] = ["all", "GK", "DEF", "MID", "FWD"];

export function PlayersGrid({ players, locale }: PlayersGridProps) {
  const t = useTranslations("players");
  const [cat, setCat] = useState<Category | "all">("all");
  const [pos, setPos] = useState<Position | "all">("all");

  const filtered = useMemo(
    () =>
      players.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (pos === "all" || p.position === pos)
      ),
    [players, cat, pos]
  );

  return (
    <div>
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-8">
        {/* Catégories */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                cat === c
                  ? "bg-primary text-white border-primary shadow-elegant"
                  : "border-border text-foreground hover:border-primary hover:text-primary"
              )}
            >
              {c === "all" ? t("filterAll") : getCategoryLabel(c, locale as "fr" | "en")}
            </button>
          ))}
        </div>

        {/* Postes */}
        <div className="flex flex-wrap gap-2 md:ml-auto">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPos(p)}
              className={cn(
                "px-3 py-2 rounded-full text-xs font-bold border transition-all uppercase tracking-wider",
                pos === p
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
              )}
            >
              {p === "all" ? t("filterPosition") : p}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{t("noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/players/${p.id}`}
              className="group rounded-xl border border-border bg-card p-5 text-center hover:border-primary hover:shadow-elegant transition-all"
            >
              <div className="flex justify-center mb-3">
                <PlayerAvatar
                  name={`${p.first_name} ${p.last_name}`}
                  photo={p.photo_url}
                  size="md"
                />
              </div>
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-tight">
                {p.first_name} {p.last_name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {getCategoryLabel(p.category, locale as "fr" | "en").split("—")[0].trim()}
              </p>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full px-2 py-0.5">
                {p.position}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Compteur */}
      <p className="text-sm text-muted-foreground text-center mt-8">
        {filtered.length} joueur{filtered.length > 1 ? "s" : ""}
        {cat !== "all" && ` · ${getCategoryLabel(cat, locale as "fr" | "en")}`}
        {pos !== "all" && ` · ${getPositionLabel(pos, locale as "fr" | "en")}`}
      </p>
    </div>
  );
}
