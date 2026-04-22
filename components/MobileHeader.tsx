'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileHeader() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? '✕' : '☰'}
      </button>
      {open && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-200 flex flex-col px-6 py-4 gap-4 text-sm shadow-sm z-50">
          <Link href="/create" onClick={() => setOpen(false)}>+Skapa</Link>
          <Link href="/voteroll" onClick={() => setOpen(false)}>VoteRoll</Link>
          <Link href="/sverigestopp10" onClick={() => setOpen(false)}>#Sveriges10 största</Link>
          <Link href="/dataprotect" onClick={() => setOpen(false)}>Dataskydd & GDPR</Link>
        </nav>
      )}
    </>
  )
}