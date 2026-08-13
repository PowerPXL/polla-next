import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PollView from './PollView'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

export const revalidate = 300 // cachea 5 min, viktigt för crawl-budget

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: poll } = await supabase
    .from('poll')
    .select('title, slug, category, total_votes')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!poll) return { title: 'Omröstningen hittades inte' }

  const { data: options } = await supabase
    .from('poll_opt')
    .select('title')
    .eq('poll_id', (poll as any).poll_id ?? 0)
    .order('sort_order')
    .limit(4)

  const alts = (options ?? []).map(o => o.title).join(', ')
  const url = `https://www.polla.se/poll/${poll.slug}`

  const description = alts
    ? `${poll.title} Rösta på ${alts}. ${poll.total_votes} personer har redan röstat – se resultatet direkt.`
    : `${poll.title} Rösta gratis och anonymt på Polla.se och se resultatet direkt.`

  return {
    title: poll.title,                       // blir "Frågan | Polla.se"
    description: description.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title: poll.title,
      description: description.slice(0, 160),
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: poll.title,
      description: description.slice(0, 160),
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: poll } = await supabase
    .from('poll')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!poll) notFound()

  const { data: options } = await supabase
    .from('poll_opt')
    .select('*')
    .eq('poll_id', poll.poll_id)
    .order('sort_order')

const { data: comments } = await supabase
  .from('comments')
  .select('*, users(name)')
  .eq('poll_id', poll.poll_id)
  .order('created_at', { ascending: false })

  let userVotedOptId: number | null = null
  if (user) {
    const { data: vote } = await supabase
      .from('poll_votes')
      .select('opt_id')
      .eq('poll_id', poll.poll_id)
      .eq('user_id', user.id)
      .single()
    userVotedOptId = vote?.opt_id ?? null
  } else {
    // Kolla cookie för anonym röstning
    const cookieStore = await cookies()
    const voted = cookieStore.get(`voted_${poll.poll_id}`)
    if (voted) {
      userVotedOptId = -1 // Dummy-värde för att markera som röstad
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <PollView
        poll={poll}
        options={options ?? []}
        comments={comments ?? []}
        userId={user?.id ?? null}
        userVotedOptId={userVotedOptId}
        userName={user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null}
      />
    </main>
  )
}