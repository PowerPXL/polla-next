'use client'
import { useState } from 'react'
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
}

type Poll = {
  poll_id: number
  title: string
  slug: string
  total_votes: number
}

export default function PollView({
  poll,
  options,
  comments,
  userId,
  userVotedOptId,
}: {
  poll: Poll
  options: Option[]
  comments: Comment[]
  userId: string | null
  userVotedOptId: number | null
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(!!userVotedOptId)
  const [loading, setLoading] = useState(false)

  const total = options.reduce((sum, o) => sum + o.vote_count, 0)

  const handleVote = async () => {
    if (!selected || hasVoted) return
    setLoading(true)
    await vote(poll.poll_id, selected, poll.slug)
    setHasVoted(true)
    setLoading(false)
  }

  return (
    <div className="space-y-10">

      {/* Poll */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{poll.title}</h1>
        <p className="text-sm text-gray-400">{total} röster</p>

        <div className="space-y-2">
          {options.map(opt => {
            const pct = total > 0 ? Math.round((opt.vote_count / total) * 100) : 0
            const isSelected = selected === opt.opt_id
            const isVoted = userVotedOptId === opt.opt_id

            return (
              <button
                key={opt.opt_id}
                type="button"
                disabled={hasVoted}
                onClick={() => !hasVoted && setSelected(opt.opt_id)}
                className={`w-full text-left p-3 rounded-xl border transition-all
                  ${isSelected || isVoted ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}
                  ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-gray-800 text-sm">{opt.title}</span>
                  <span className="text-xs text-gray-400 ml-2">{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${isVoted ? 'bg-blue-500' : 'bg-gray-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>

        {!hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selected || loading}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all
              ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {loading ? 'Röstar...' : 'Rösta'}
          </button>
        )}

        {hasVoted && (
          <p className="text-sm text-green-600 text-center">✓ Din röst är registrerad</p>
        )}
      </div>

      {/* Kommentarer */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Kommentarer</h2>

        {/* Formulär */}
        <form
          action={async (formData) => {
            await addComment(poll.poll_id, poll.slug, formData)
          }}
          className="space-y-2"
        >
          <textarea
            name="comment"
            required
            maxLength={500}
            placeholder={userId ? 'Skriv en kommentar...' : 'Kommentera som gäst...'}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <button
            type="submit"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Skicka
          </button>
        </form>

        {/* Lista */}
        {comments.length === 0 && (
          <p className="text-sm text-gray-400">Inga kommentarer än.</p>
        )}
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.comment_id} className="border-b border-gray-100 pb-4">
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