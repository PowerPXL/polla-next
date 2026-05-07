'use client'
import { useState } from 'react'
import { Globe, Users } from 'lucide-react'
import { vote, addComment } from './actions'

 
type Option = {
  opt_id: number
  title: string
  vote_count: number
}

type Comment = {
  comment_id: number
  comment: string
  created_at: string
  users: { name: string } | null
}

type Poll = {
  poll_id: number
  title: string
  slug: string
  total_votes: number
  category: string | null
  poll_type: string | null
}

const COLORS = ['#EA4335', '#4285F4', '#FBBC05', '#374151']
const getColor = (i: number) => COLORS[i] ?? '#374151'

function DonutChart({ options }: { options: Option[] }) {
  const total = options.reduce((sum, o) => sum + o.vote_count, 0)
  if (total === 0) return <p className="text-sm text-gray-400 text-center">Inga röster än</p>

  const size = 200
  const radius = 80
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 32

  let cumulative = 0
  const slices = options.map((opt, i) => {
    const pct = opt.vote_count / total
    const start = cumulative
    cumulative += pct
    return { pct, start, color: getColor(i), title: opt.title }
  })

  const polarToCartesian = (pct: number) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start)
    const e = polarToCartesian(end)
    const largeArc = end - start > 0.5 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={describeArc(slice.start, slice.start + slice.pct)}
            fill="none"
            stroke={slice.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-sm" fontSize={13} fill="#6b7280">
          {total} röster
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt, i) => (
          <div key={opt.opt_id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getColor(i) }} />
            <span className="text-xs text-gray-600">{opt.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PollView({
  poll,
  options,
  comments,
  userId,
  userVotedOptId,
  userName,
}: {
  poll: Poll
  options: Option[]
  comments: Comment[]
  userId: string | null
  userVotedOptId: number | null
  userName: string | null
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(!!userVotedOptId)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const total = options.reduce((sum, o) => sum + o.vote_count, 0)

  const handleVote = async () => {
  if (!selected || hasVoted) return
  setLoading(true)
  const result = await vote(poll.poll_id, selected, poll.slug)

  if (result?.redirect) {
    window.location.href = result.redirect
    return
  }

  setHasVoted(true)
  setLoading(false)
  window.location.reload()
}

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* Poll-kort */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

        {/* Header */}
        <div className="space-y-2">
          {poll.category && (
            <div className="flex items-center gap-1">
              {poll.poll_type === 'global' ? (
                <Globe className="h-4 w-4 text-yellow-500" aria-label="Global" />
              ) : poll.poll_type === 'local' ? (
                <Users className="h-4 w-4 text-gray-500" aria-label="Lokal" />
              ) : null}
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {poll.category}
              </span>
            </div>
          )}
          <h1 className="font-bold text-2xl text-gray-900 leading-snug">{poll.title}</h1>
          <p className="text-sm text-gray-400">{total} röster</p>
        </div>

        {/* Alternativ */}
        <div className="space-y-2">
          {options.map((opt, i) => {
            const pct = total > 0 ? Math.round((opt.vote_count / total) * 100) : 0
            const isSelected = selected === opt.opt_id
            const isVoted = userVotedOptId === opt.opt_id

            return (
              <button
                key={opt.opt_id}
                type="button"
                disabled={hasVoted}
                onClick={() => !hasVoted && setSelected(opt.opt_id)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-150
                  ${isSelected || isVoted ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}
                  ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getColor(i) }} />
                    <span className="font-medium text-gray-800 text-sm">{opt.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: getColor(i) }}
                  />
                </div>
              </button>
            )
          })}
        </div>
        {/* Rösta */}
        {!hasVoted && (
          (userId || poll.poll_type === 'local') ? (
            <button
              onClick={handleVote}
              disabled={!selected || loading}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all
                ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {loading ? 'Röstar...' : 'Rösta'}
            </button>
          ) : (
            <a href="/login"
              className={`w-full py-3 rounded-xl text-sm font-medium text-center block transition-all
                ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'}`}
            >
              Rösta
            </a>
          )
        )}
        {/* Donut */}
        <div className="pt-4 border-t border-gray-100">
          <DonutChart options={options} />
        </div>
        
        {/* Dela */}
<div className="pt-4 border-t border-gray-100">
  <p className="text-xs text-gray-400 mb-2">Dela</p>
  <div className="flex gap-2">
      <a href={`https://twitter.com/intent/tweet?url=https://polla.se/poll/${poll.slug}&text=${encodeURIComponent(poll.title)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:opacity-80 transition-opacity"
    >
      X
      </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://polla.se/poll/${poll.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-medium hover:opacity-80 transition-opacity">
        LinkedIn
      </a>
    
      <a href={`https://www.facebook.com/sharer/sharer.php?u=https://polla.se/poll/${poll.slug}`}
        target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-medium hover:opacity-80 transition-opacity">
      Facebook
    </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(poll.title + ' https://polla.se/poll/' + poll.slug)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-medium hover:opacity-80 transition-opacity">
        WhatsApp
    </a>
    <button
      onClick={() => {
        navigator.clipboard.writeText(`https://polla.se/poll/${poll.slug}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
    >
      {copied ? 'Kopierad!' : 'Kopiera länk'}
    </button>

  </div>
</div>
      </div>

      {/* Kommentarer */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Kommentarer</h2>
      
      {userId ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
              {userName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="text-sm text-gray-600">{userName}</span>
          </div>
          <form
            action={async (formData) => {
              await addComment(poll.poll_id, poll.slug, formData)
              window.location.reload() 
            }}
            className="space-y-2"
          >
            <textarea
              name="comment"
              required
              maxLength={500}
              placeholder="Skriv en kommentar..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kommentera
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          <a href="/login" className="text-blue-600 hover:underline">Logga in</a> för att kommentera.
        </p>
      )}

        {comments.length === 0 && (
          <p className="text-sm text-gray-400">Inga kommentarer än.</p>
        )}
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.comment_id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                  {c.users?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="text-xs font-medium text-gray-700">{c.users?.name ?? 'Anonym'}</span>
              </div>
              <p className="text-sm text-gray-800">{c.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.created_at).toLocaleDateString('sv-SE', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}