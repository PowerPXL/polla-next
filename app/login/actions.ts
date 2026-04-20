"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type OAuthProvider = "google" | "twitter";

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) redirect("/error");
  if (data.url) redirect(data.url);
}