import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PollView from './PollView'

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
    .select('*')
    .eq('poll_id', poll.poll_id)
    .eq('is_active', true)
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
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <PollView
        poll={poll}
        options={options ?? []}
        comments={comments ?? []}
        userId={user?.id ?? null}
        userVotedOptId={userVotedOptId}
      />
    </main>
  )
}