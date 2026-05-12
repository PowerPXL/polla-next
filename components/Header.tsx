'use server'; 

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import MobileHeader from "./MobileHeader";
import SearchBar from "./SearchBar";
import { Plus, CircleUser } from "lucide-react";


// Server‑action för att logga ut
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}


export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: searchPolls } = await supabase
    .from('poll')
    .select('poll_id,title,slug,category')
    .eq('is_active', true)
    .order('title');

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase() ?? null;
  const polls = searchPolls ?? [];


  return (
    <header className="border-b border-zinc-200 relative bg-gray-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">

        {/* Logo */}
        <div className="flex items-center gap-6 w-full">
          <div className="text-3xl font-bold tracking-tight">
            <Link href="/">
              <span className="text-[#374151]">Po</span>
              <span className="text-[#EA4335]">ll</span>
              <span className="text-[#4285F4]">a</span>
              <span className="text-[#FBBC05]">.</span>
              <span className="text-gray-400 text-lg">se</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1">
            <SearchBar polls={polls} />
          </div>
        </div>


        <nav className="hidden md:flex items-center gap-6 whitespace-nowrap">
          <Link
            href="/create"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4 text-[#FBBC05]" />
            Skapa
          </Link>

          <Link
            href="/dataprotect"
            className="hover:text-blue-600 transition-colors"
          >
            Dataskydd & GDPR
          </Link>

          {userInitial ? (
            // Logga ut‑knapp med server‑action INNANför formuläret
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Logga ut
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <CircleUser className="h-4 w-4" />
              Logga in
            </Link>
          )}
        </nav>


        <MobileHeader />

      </div>
    </header>
  );
}