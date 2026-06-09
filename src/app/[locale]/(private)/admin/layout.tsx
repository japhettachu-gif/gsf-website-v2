import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name, avatar_url")
    .eq("id", user.id)
    .single() as { data: { role: string; display_name: string; avatar_url: string } | null };

  const allowedRoles = ["super_admin", "technical_director", "coach", "logistics"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect(`/${locale}`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <AdminSidebar locale={locale} role={profile.role as UserRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          locale={locale}
          userName={profile.display_name}
          userRole={profile.role as UserRole}
          avatarUrl={profile.avatar_url}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}