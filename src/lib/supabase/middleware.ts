import { createClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(
  request: NextRequest,
  isProtected: boolean,
  isAuthPath: boolean
) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Rediriger vers login si route protégée et non authentifié
  if (isProtected && !user) {
    const locale = request.nextUrl.pathname.split("/")[1] || "fr";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rediriger vers dashboard si déjà connecté et sur page auth
  if (isAuthPath && user) {
    const locale = request.nextUrl.pathname.split("/")[1] || "fr";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return supabaseResponse;
}
