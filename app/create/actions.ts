'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createPoll(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
console.log('USER:', user?.id ?? 'anon')
  const title = formData.get('title') as string
  const options = formData.getAll('options') as string[]

  if (!title || options.length < 2) return

  // Skapa slug från titel
  const slug = title
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Skapa poll
  const { data: poll, error } = await supabase
    .from('poll')
    .insert({
      title,
      slug,
      created_by: user?.id ?? null,
    })
    .select('poll_id')
    .single()

    console.log('POLL ERROR:', JSON.stringify(error))
    console.log('POLL DATA:', JSON.stringify(poll))

  if (error || !poll) throw new Error(error?.message ?? 'Kunde inte skapa poll')

  // Skapa svarsalternativ
  const opts = options
    .map((text, i) => ({ poll_id: poll.poll_id, title: text, sort_order: i }))
    .filter(o => o.title.trim() !== '')

  await supabase.from('poll_opt').insert(opts)

  redirect(`/poll/${slug}`)
}