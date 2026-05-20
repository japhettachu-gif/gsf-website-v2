import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("loginTitle") };
}

export default function LoginPage() {
  const t = useTranslations("auth");
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white font-display font-bold text-lg mb-4">
            GSF
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {t("loginTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("loginSubtitle")}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
