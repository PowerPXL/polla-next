import { createClient } from '@/lib/supabase/server'
import CreatePollForm from './CreatePoll'

export const metadata = {
  title: 'Skapa',
  description: 'Skapa röstningar gratis -utan inlogg.',
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">+ Skapa</h1>
      <p className="text-gray-500 text-sm mb-8">Frågor och svar – gratis, utan inlogg.</p>
      <CreatePollForm isLoggedIn={!!user} />
    </main>
  )
}