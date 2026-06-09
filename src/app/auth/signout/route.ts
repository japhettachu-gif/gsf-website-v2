import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();

  const locale = request.nextUrl.pathname.split("/")[1] || "fr";
  return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
}

