import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/poll?slug=eq.${slug}&select=title,category&limit=1`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
    }
  )
  const data = await res.json()
  console.log('OG DATA:', JSON.stringify(data))
  const poll = data?.[0]

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
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
          <span style={{ color: '#374151', fontSize: 64, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>Po</span>
          <span style={{ color: '#EA4335', fontSize: 64, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>ll</span>
          <span style={{ color: '#4285F4', fontSize: 64, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>a</span>
          <span style={{ color: '#FBBC05', fontSize: 64, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>.</span>
          <span style={{ color: '#9ca3af', fontSize: 40, fontWeight: 600, lineHeight: 1, marginBottom: 6 }}>se</span>
        </div>

        {/* Fråga */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#111827',
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {poll?.title ?? 'Rösta på Polla.se'}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 24, color: '#9ca3af', fontWeight: 500 }}>
            {poll?.category ? `#${poll.category}` : 'polla.se'}
          </span>
          <div
            style={{
              display: 'flex',
              background: '#374151',
              color: 'white',
              fontSize: 22,
              fontWeight: 700,
              padding: '14px 36px',
              borderRadius: 16,
            }}
          >
            Rösta nu →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
