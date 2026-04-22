'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function vote(pollId: number, optId: number, slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Anonym röst – kolla inte dubletter (kan byggas ut med cookie senare)
  await supabase.from('poll_votes').insert({
    poll_id: pollId,
    opt_id: optId,
    user_id: user?.id ?? null,
  })

  // Öka vote_count på alternativet
  await supabase.rpc('increment_vote', { opt_id_input: optId, poll_id_input: pollId })

  revalidatePath(`/poll/${slug}`)
}

export async function addComment(pollId: number, slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const comment = formData.get('comment') as string

  if (!comment?.trim()) return

  await supabase.from('comments').insert({
    poll_id: pollId,
    comment: comment.trim(),
    created_by: user?.id ?? null,
  })

  revalidatePath(`/poll/${slug}`)
}