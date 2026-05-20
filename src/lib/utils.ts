import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, Position, Rating, UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Labels ───────────────────────────────────────────────────────────────────
export function getCategoryLabel(category: Category, locale: "fr" | "en" = "fr"): string {
  const labels: Record<Category, Record<string, string>> = {
    U10_U12: { fr: "U10–U12 — Initiation", en: "U10–U12 — Initiation" },
    U13_U15: { fr: "U13–U15 — Développement", en: "U13–U15 — Development" },
    U16_U18: { fr: "U16–U18 — Élite", en: "U16–U18 — Elite" },
  };
  return labels[category][locale];
}

export function getPositionLabel(position: Position, locale: "fr" | "en" = "fr"): string {
  const labels: Record<Position, Record<string, string>> = {
    GK: { fr: "Gardien", en: "Goalkeeper" },
    DEF: { fr: "Défenseur", en: "Defender" },
    MID: { fr: "Milieu", en: "Midfielder" },
    FWD: { fr: "Attaquant", en: "Forward" },
  };
  return labels[position][locale];
}

export function getRatingLabel(rating: Rating, locale: "fr" | "en" = "fr"): string {
  const labels: Record<Rating, Record<string, string>> = {
    developing: { fr: "En progression", en: "Developing" },
    satisfactory: { fr: "Satisfaisant", en: "Satisfactory" },
    good: { fr: "Bien", en: "Good" },
    excellent: { fr: "Excellent", en: "Excellent" },
  };
  return labels[rating][locale];
}

export function getRatingColor(rating: Rating): string {
  const colors: Record<Rating, string> = {
    developing: "text-red-500 bg-red-50 border-red-200",
    satisfactory: "text-yellow-600 bg-yellow-50 border-yellow-200",
    good: "text-green-600 bg-green-50 border-green-200",
    excellent: "text-amber-600 bg-amber-50 border-amber-200",
  };
  return colors[rating];
}

export function getRoleLabel(role: UserRole, locale: "fr" | "en" = "fr"): string {
  const labels: Record<UserRole, Record<string, string>> = {
    super_admin: { fr: "Super Administrateur", en: "Super Admin" },
    technical_director: { fr: "Directeur Technique", en: "Technical Director" },
    coach: { fr: "Encadreur", en: "Coach" },
    logistics: { fr: "Gestionnaire Logistique", en: "Logistics Manager" },
    parent: { fr: "Parent", en: "Parent" },
    player: { fr: "Joueur", en: "Player" },
    public: { fr: "Visiteur", en: "Visitor" },
  };
  return labels[role][locale];
}

// ─── Dates ────────────────────────────────────────────────────────────────────
export function formatDate(date: string, locale: "fr" | "en" = "fr"): string {
  return new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: string, locale: "fr" | "en" = "fr"): string {
  return new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Player ───────────────────────────────────────────────────────────────────
export function getPlayerAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ─── Permissions ──────────────────────────────────────────────────────────────
export function canAccess(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAdmin(role: UserRole): boolean {
  return ["super_admin", "technical_director"].includes(role);
}

export function isStaff(role: UserRole): boolean {
  return ["super_admin", "technical_director", "coach", "logistics"].includes(role);
}
