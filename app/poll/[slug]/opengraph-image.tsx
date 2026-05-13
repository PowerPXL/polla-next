import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: poll } = await supabase
    .from('poll')
    .select('title, category, total_votes, poll_opt(title, vote_count)')
    .eq('slug', params.slug)
    .single()

  const options = (poll?.poll_opt ?? []) as { title: string; vote_count: number }[]
  const total = options.reduce((sum, o) => sum + o.vote_count, 0)
  const COLORS = ['#EA4335', '#4285F4', '#FBBC05', '#374151']

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#374151' }}>Polla.se</span>
          {poll?.category && (
            <span style={{ fontSize: 18, background: '#e5e7eb', color: '#374151', padding: '6px 16px', borderRadius: 99 }}>
              {poll.category}
            </span>
          )}
        </div>

        {/* Fråga */}
        <div style={{ fontSize: 52, fontWeight: 800, color: '#111827', lineHeight: 1.2, maxWidth: 900 }}>
          {poll?.title}
        </div>

        {/* Staplar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {options.slice(0, 4).map((opt, i) => {
            const pct = total > 0 ? Math.round((opt.vote_count / total) * 100) : 0
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, color: '#6b7280', width: 200, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {opt.title}
                </span>
                <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 99, height: 16 }}>
                  <div style={{ width: `${pct}%`, background: COLORS[i], borderRadius: 99, height: 16 }} />
                </div>
                <span style={{ fontSize: 16, color: '#374151', fontWeight: 600, width: 48, textAlign: 'right' }}>
                  {pct}%
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 18, color: '#9ca3af' }}>
          {total} röster · Rösta på polla.se
        </div>
      </div>
    ),
    { ...size }
  )
}