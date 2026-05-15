'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

type PollSearchItem = {
  poll_id: number
  title: string
  slug: string
  category: string | null
}

export default function SearchBar({ polls }: { polls: PollSearchItem[] }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredPolls = useMemo(() => {
    if (!normalizedQuery) return []
    return polls.filter((poll) =>
      poll.title.toLowerCase().includes(normalizedQuery) ||
      poll.category?.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery, polls])

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        polls
          .map((poll) => poll.category)
          .filter((category): category is string => !!category)
      )
    )
    if (!normalizedQuery) return unique
    return unique.filter((category) =>
      category.toLowerCase().includes(normalizedQuery)
    )
  }, [normalizedQuery, polls])

  // ✅ RÄTT PLATS – inne i komponenten
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <label className="sr-only" htmlFor="poll-search">
        Sök omröstningar
      </label>

      <div className="relative">
        <input
          id="poll-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Hej, vad vill du rösta om?"
          className="w-full rounded-2xl border border-gray-300 bg-white pl-4 pr-10 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
          <div className="divide-y divide-gray-100">

            {/* Kategorier */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Kategorier
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${encodeURI(category.toLowerCase())}`}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {category}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    Inga kategorier hittades
                  </p>
                )}
              </div>
            </div>

            {/* Polls */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Omröstningar
              </p>

              <div className="mt-2 space-y-2">
                {normalizedQuery ? (
                  filteredPolls.length > 0 ? (
                    filteredPolls.map((poll) => (
                      <Link
                        key={poll.poll_id}
                        href={`/poll/${poll.slug}`}
                        className="block rounded-2xl px-3 py-3 transition hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {poll.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {poll.category ?? 'Kategori saknas'}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Inga omröstningar matchar sökningen
                    </p>
                  )
                ) : (
                  polls.slice(0, 5).map((poll) => (
                    <Link
                      key={poll.poll_id}
                      href={`/poll/${poll.slug}`}
                      className="block rounded-2xl px-3 py-3 transition hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {poll.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {poll.category ?? 'Kategori saknas'}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
``