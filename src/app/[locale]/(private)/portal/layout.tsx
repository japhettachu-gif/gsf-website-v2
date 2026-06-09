import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getInitials } from "@/lib/utils";
import { LayoutDashboard, User, Calendar, Star, LogOut } from "lucide-react";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["player", "parent"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect(`/${locale}/admin`);
  }

  const isParent = profile.role === "parent";

  const navItems = isParent
    ? [
        { href: "/portal/parent", label: "Mes enfants", icon: LayoutDashboard },
        { href: "/portal/parent/progression", label: "Progression", icon: Star },
      ]
    : [
        { href: "/portal/profile", label: "Mon profil", icon: User },
        { href: "/portal/schedule", label: "Mon planning", icon: Calendar },
        { href: "/portal/evaluations", label: "Mes bulletins", icon: Star },
      ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="container-gsf flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-display font-bold text-xs">
              GSF
            </div>
            <span className="font-display font-bold text-sm text-foreground">
              {isParent ? "Espace Parent" : "Espace Joueur"}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {getInitials(profile.display_name)}
            </div>
            <form action={`/${locale}/auth/signout`} method="post">
              <button className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container-gsf py-8">{children}</main>
    </div>
  );
}
