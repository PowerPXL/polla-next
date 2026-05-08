// Header.tsx - fortfarande async server component
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import MobileHeader from "./MobileHeader"
import SearchBar from "./SearchBar"

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: searchPolls } = await supabase
    .from('poll')
    .select('poll_id,title,slug,category')
    .eq('is_active', true)
    .order('title')

  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? null
  const polls = searchPolls ?? []

  return (
    <header className="border-b border-zinc-200 relative bg-gray-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 bg">
        
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

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/create" className="hover:text-blue-600 transition-colors">+Skapa</Link>
          <Link href="/dataprotect" className="hover:text-blue-600 transition-colors">Dataskydd & GDPR</Link>
        </nav>

        {/* Login */}
        <div className="flex items-center gap-3">
          {userInitial ? (
            <Link href="/profile" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors">
              {userInitial}
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
              Logga in
            </Link>
          )}

          {/* Enda nya grejen */}
          <MobileHeader />
        </div>

      </div>
    </header>
  )
}