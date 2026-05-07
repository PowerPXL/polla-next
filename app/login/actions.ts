"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) redirect("/error");
  if (data.url) redirect(data.url);
}

export async function signInWithFacebook() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) redirect("/error");
  if (data.url) redirect(data.url);
}

export async function handlePostLogin(searchParams: URLSearchParams) {
  const pollId = searchParams.get('poll');
  const optionId = searchParams.get('option');
  const slug = searchParams.get('slug');

  if (pollId && optionId && slug) {
    // Import the vote action dynamically
    const { vote } = await import("../poll/[slug]/actions");
    const result = await vote(parseInt(pollId), parseInt(optionId), slug);

    if (result?.error) {
      // Handle error - maybe redirect to poll with error message
      redirect(`/poll/${slug}?error=${result.error}`);
    } else {
      // Success - redirect to poll
      redirect(`/poll/${slug}`);
    }
  } else {
    // No pending vote - redirect to home
    redirect('/');
  }
}