import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Check if there are poll voting parameters to preserve
  const poll = searchParams.get("poll");
  const option = searchParams.get("option");
  const slug = searchParams.get("slug");

  let redirectUrl = `${origin}/`;
  if (poll && option && slug) {
    redirectUrl = `${origin}/login?authenticated=true&poll=${poll}&option=${option}&slug=${slug}`;
  }

  return NextResponse.redirect(redirectUrl);
}

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect("https://www.polla.se/");
}