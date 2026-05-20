"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import {
  LayoutDashboard, Users, UserCheck, Calendar, Trophy,
  Tent, FileText, Package, ClipboardList, Image,
  Newspaper, Handshake, GraduationCap, Settings,
  Star, ChevronRight,
} from "lucide-react";

interface NavItem {
  key: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "technical_director", "coach", "logistics"] },
  { key: "players", href: "/admin/players", icon: Users, roles: ["super_admin", "technical_director", "coach"] },
  { key: "coaches", href: "/admin/coaches", icon: UserCheck, roles: ["super_admin", "technical_director"] },
  { key: "training", href: "/admin/training", icon: Calendar, roles: ["super_admin", "technical_director", "coach"] },
  { key: "competitions", href: "/admin/competitions", icon: Trophy, roles: ["super_admin", "technical_director"] },
  { key: "bootCamp", href: "/admin/boot-camp", icon: Tent, roles: ["super_admin", "technical_director"] },
  { key: "applications", href: "/admin/applications", icon: FileText, roles: ["super_admin", "technical_director"] },
  { key: "evaluations", href: "/admin/evaluations", icon: Star, roles: ["super_admin", "technical_director", "coach"] },
  { key: "logistics", href: "/admin/logistics", icon: Package, roles: ["super_admin", "technical_director", "logistics"] },
  { key: "media", href: "/admin/media", icon: Image, roles: ["super_admin", "technical_director"] },
  { key: "news", href: "/admin/news", icon: Newspaper, roles: ["super_admin", "technical_director"] },
  { key: "partners", href: "/admin/partners", icon: Handshake, roles: ["super_admin"] },
  { key: "alumni", href: "/admin/alumni", icon: GraduationCap, roles: ["super_admin", "technical_director"] },
  { key: "users", href: "/admin/users", icon: ClipboardList, roles: ["super_admin"] },
  { key: "settings", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
];

interface AdminSidebarProps {
  locale: string;
  role: UserRole;
}

export function AdminSidebar({ locale, role }: AdminSidebarProps) {
  const t = useTranslations("admin");
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    if (href === "/admin") return pathname === full;
    return pathname.startsWith(full);
  };

  return (
    <aside className="admin-sidebar flex h-screen w-64 shrink-0 flex-col overflow-hidden">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-display font-bold text-xs shrink-0">
          GSF
        </div>
        <div>
          <p className="font-display font-bold text-white text-sm leading-tight">
            Genius Soccer
          </p>
          <p className="text-[10px] text-gold font-semibold uppercase tracking-wider">
            Admin Platform
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-primary/25 text-white border-l-2 border-primary pl-[10px]"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-primary" : "text-white/40 group-hover:text-white/70"
              )} />
              <span className="flex-1">{t(item.key as any)}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-primary/70" />}
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold text-[#0D0D0D] text-[10px] font-bold px-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="border-t border-white/10 p-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ChevronRight className="h-3 w-3 rotate-180" />
          Retour au site public
        </Link>
      </div>
    </aside>
  );
}
