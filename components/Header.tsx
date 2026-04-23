// Header.tsx - fortfarande async server component
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import MobileHeader from "./MobileHeader"

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? null

  return (
    <header className="border-b border-zinc-200 relative">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        
        {/* Logo - oförändrad */}
        <div className="text-3xl font-bold tracking-tight">
          <Link href="/">
            <span className="text-[#374151]">Po</span>
            <span className="text-[#EA4335]">ll</span>
            <span className="text-[#4285F4]">a</span>
            <span className="text-[#FBBC05]">.</span>
            <span className="text-gray-400 text-lg">se</span>
          </Link>
        </div>

        {/* Desktop nav - oförändrad */}
        <nav className="hidden md:flex gap-6">
          <Link href="/create" className="hover:text-blue-600 transition-colors">+Skapa</Link>
          <Link href="/voteroll" className="hover:text-blue-600 transition-colors">VoteRoll</Link>
          <Link href="/sverigestopp10" className="hover:text-blue-600 transition-colors">#Sveriges10 största</Link>
          <Link href="/dataprotect" className="hover:text-blue-600 transition-colors">Dataskydd & GDPR</Link>
        </nav>

        {/* Login - oförändrad */}
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