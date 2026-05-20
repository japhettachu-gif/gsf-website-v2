"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn, getInitials, getRoleLabel } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";

interface AdminHeaderProps {
  locale: string;
  userName: string;
  userRole: UserRole;
  avatarUrl?: string | null;
}

export function AdminHeader({
  locale, userName, userRole, avatarUrl,
}: AdminHeaderProps) {
  const t = useTranslations();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white/95 backdrop-blur-sm px-6 shrink-0">
      {/* Breadcrumb zone — vide, rempli par les pages */}
      <div id="admin-breadcrumb" />

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-1.5 hover:bg-accent transition-colors"
          >
            {/* Avatar */}
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                {getInitials(userName)}
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-foreground leading-tight">{userName}</p>
              <p className="text-[11px] text-muted-foreground">{getRoleLabel(userRole, locale as "fr" | "en")}</p>
            </div>
            <ChevronDown className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              menuOpen && "rotate-180"
            )} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border border-border bg-white shadow-elegant py-1">
                <Link
                  href={`/${locale}/admin/profile`}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Mon profil
                </Link>
                {userRole === "super_admin" && (
                  <Link
                    href={`/${locale}/admin/settings`}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    {t("admin.settings")}
                  </Link>
                )}
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t("auth.signOut")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
