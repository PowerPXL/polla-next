import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        
        <div className="text-xl font-bold">
          <Link href="/">Polla.se</Link>
        </div>

        <nav className="flex gap-6">
          <Link href="/create" className="hover:text-blue-600 transition-colors">+Skapa</Link>
          <Link href="/voteroll" className="hover:text-blue-600 transition-colors">VoteRoll</Link>
          <Link href="/sverigestopp10" className="hover:text-blue-600 transition-colors">#Sveriges10 största</Link>
          <Link href="/dataprotect" className="hover:text-blue-600 transition-colors">Dataskydd & GDPR</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" title="Min sida">
                <svg className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
              <form action="/auth/callback" method="post">
                <button type="submit" title="Logga ut">
                  <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="font-medium hover:text-blue-600 transition-colors">
              Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}