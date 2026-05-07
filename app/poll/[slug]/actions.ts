'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function vote(pollId: number, optId: number, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if poll requires authentication
  const { data: poll } = await supabase
    .from('poll')
    .select('poll_type')
    .eq('poll_id', pollId)
    .single()

  // If poll requires authentication and user is not logged in, redirect to login
  if (poll?.poll_type !== 'local' && !user) {
    return { redirect: `/login?poll=${pollId}&option=${optId}&slug=${slug}` }
  }

  if (user) {
    const { data: existing } = await supabase
      .from('poll_votes')
      .select('vote_id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) return { error: 'already_voted' }
  }

  await supabase.from('poll_votes').insert({
    poll_id: pollId,
    opt_id: optId,
    user_id: user?.id ?? null,
  })

  // Cookie for local polls
  if (!user && poll?.poll_type === 'local') {
    try {
      const cookieStore = await cookies()
      cookieStore.set(`voted_${pollId}`, 'true', {
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    } catch (error) {
      console.error('Cookie error:', error)
    }
  }

  await supabase.rpc('increment_vote', { opt_id_input: optId, poll_id_input: pollId })

  revalidatePath(`/poll/${slug}`)
}

export async function addComment(pollId: number, slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'not_logged_in' }

  const comment = formData.get('comment') as string

  if (!comment?.trim()) return

  await supabase.from('comments').insert({
    poll_id: pollId,
    comment: comment.trim(),
    created_by: user.id,
  })

  revalidatePath(`/poll/${slug}`)
}