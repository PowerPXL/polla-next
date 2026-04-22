import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold">Min sida</h1>
      <p className="text-gray-500 mt-2">{user.email}</p>

      <form action={signOut}>
        <button type="submit" className="mt-6 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
          Logga ut
        </button>
      </form>
    </main>
  );
}