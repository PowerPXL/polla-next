import Link from "next/link";

export default function Header() {
  return (
<header className="border-b border-zinc-200">
  <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
    
    <div className="text-xl font-bold">
      <Link href="/">Polla.se</Link>
    </div>

<nav className="flex gap-6">
  <Link href="/create" className="hover:text-blue-600 transition-colors">+Skapa</Link>
  <Link href="/voteroll" className="hover:text-blue-600 transition-colors">VoteRoll</Link>
  <Link href="/sverigestopp10" className="hover:text-blue-600 
  transition-colors">#Sveriges10 största</Link>
  <Link href="/dataprotect" className="hover:text-blue-600 transition-colors">Dataskydd & GDPR</Link>
</nav>

<div>
  <Link href="/login" className="font-medium hover:text-blue-600 transition-colors">Login</Link>
</div>

  </div>
</header>
  );
}