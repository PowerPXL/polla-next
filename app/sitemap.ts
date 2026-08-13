import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://www.polla.se'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: polls } = await supabase
    .from('poll')
    .select('slug, updated_at, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5000)

  const pollUrls = (polls ?? []).map(p => ({
    url: `${BASE}/poll/${p.slug}`,
    lastModified: new Date(p.updated_at ?? p.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/create`, changeFrequency: 'monthly', priority: 0.9 },
    ...pollUrls,
  ]
}
