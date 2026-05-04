'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function vote(pollId: number, optId: number, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'not_logged_in' }

  const { data: existing } = await supabase
    .from('poll_votes')
    .select('vote_id')
    .eq('poll_id', pollId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) return { error: 'already_voted' }

  const { error: insertError } = await supabase.from('poll_votes').insert({
    poll_id: pollId,
    opt_id: optId,
    user_id: user.id,
  })

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
    created_by: user?.id ?? null,
  })

  revalidatePath(`/poll/${slug}`)
}