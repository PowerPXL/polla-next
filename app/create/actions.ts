'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createPoll(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const options = formData.getAll('options') as string[]
  const category = formData.get('category') as string | null
  const pollType = formData.get('poll_type') as string | null

  if (!title || options.length < 2) return

  // Skapa slug från titel
  const baseSlug = title
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  // Kolla om samma slug finns, lägg till siffra
  let slug = baseSlug
  let counter = 1
  while (true) {
    const { data: existing } = await supabase
      .from('poll')
      .select('poll_id')
      .eq('slug', slug)
      .maybeSingle()
    if (!existing) break
    slug = `${baseSlug}-${counter}`
    counter++
  }

  // Skapa poll
  const { data: poll, error } = await supabase
    .from('poll')
    .insert({
      title,
      slug,
      category: category || null,
      poll_type: pollType ?? 'global',
      created_by: user?.id ?? null,
    })
    .select('poll_id')
    .single()

  if (error || !poll) throw new Error(error?.message ?? 'Kunde inte skapa poll')

  // Skapa svarsalternativ
  const opts = options
    .map((text, i) => ({ poll_id: poll.poll_id, title: text, sort_order: i }))
    .filter(o => o.title.trim() !== '')

  await supabase.from('poll_opt').insert(opts)

  redirect(`/poll/${slug}`)
}