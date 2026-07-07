import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";

const locales = ["fr", "en"] as const;
const defaultLocale = "fr";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Routes qui nécessitent une authentification
const PROTECTED_PATHS = [
  "/admin",
  "/portal",
  "/dashboard",
];

// Routes accessibles seulement sans auth (login, signup)
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retirer le préfixe de locale pour la vérification
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";

  // Appliquer l'internationalisation
  const intlResponse = intlMiddleware(request);

  // Vérifier les routes protégées
  const isProtected = PROTECTED_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );
  const isAuthPath = AUTH_PATHS.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (isProtected || isAuthPath) {
    return updateSession(request, isProtected, isAuthPath);
  }

  return intlResponse;
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et API
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};