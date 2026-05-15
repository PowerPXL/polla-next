'use server'

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import SearchBar from "./SearchBar"
import { Plus, CircleUser } from "lucide-react"


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: searchPolls } = await supabase
    .from('poll')
    .select('poll_id,title,slug,category')
    .eq('is_active', true)
    .order('title')

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase() ?? null

  const polls = searchPolls ?? []

  return (
    <header className="border-b border-zinc-200 bg-gray-50">

      {/* TOP RAD */}
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 md:px-6 py-4 md:py-6">

        {/* vänster: hamburger + logo */}
        <div className="flex items-center gap-4">

          {/* hamburger (mobil) */}
          <button className="md:hidden">
            ≡
          </button>

          {/* logo */}
          <div className="text-3xl font-bold tracking-tight">
            <Link href="/">
              <span className="text-[#374151]">Po</span>
              <span className="text-[#EA4335]">ll</span>
              <span className="text-[#4285F4]">a</span>
              <span className="text-[#FBBC05]">.</span>
              <span className="text-gray-400 text-lg">se</span>
            </Link>
          </div>
        </div>

        {/* desktop search */}
        <div className="hidden md:flex flex-1 px-6">
          <SearchBar polls={polls} />
        </div>

        {/* höger: nav */}
        <nav className="flex items-center gap-4 md:gap-6">

          {/* desktop-only länkar */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              href="/create"
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <Plus className="h-4 w-4 text-[#FBBC05]" />
              Skapa
            </Link>

            <Link href="/dataprotect">
              Dataskydd & GDPR
            </Link>

          </div>

          {/* login / logout */}
          {userInitial ? (
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
              >
                Logga ut
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              <CircleUser className="h-4 w-4" />
              Logga in
            </Link>
          )}
        </nav>
      </div>

      {/* MOBIL SEARCH (under header) */}
      <div className="md:hidden px-4 pb-4">
        <SearchBar polls={polls} />
      </div>

    </header>
  )
}