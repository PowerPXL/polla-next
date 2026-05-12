import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Vote } from 'lucide-react';
import ContentCard from '@/components/ContentCard';
import { error } from 'console';

export default async function MyPollsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

const { data: polls, error } = await supabase
  .from('poll')
  .select('poll_id, title, slug, poll_type, category')
  .eq('user_id', user.id)

console.log('POLLS:', JSON.stringify(polls, null, 2));
console.log('ERROR:', JSON.stringify(error, null, 2));

  
  const pollIds = polls?.map(p => p.poll_id) ?? [];

  const { data: commentCounts } = pollIds.length > 0
    ? await supabase.from('comments').select('poll_id').in('poll_id', pollIds)
    : { data: [] };

  const commentsCountMap = (commentCounts ?? []).reduce((acc, c) => {
    acc[c.poll_id] = (acc[c.poll_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const items = (polls ?? []).map(poll => ({
    id: String(poll.poll_id),
    title: poll.title,
    slug: poll.slug,
    poll_type: poll.poll_type ?? null,
    category: poll.category ?? null,
    options: poll.poll_opt.map((opt: { opt_id: number; title: string; vote_count: number }) => ({
      id: String(opt.opt_id),
      text: opt.title,
      votes: opt.vote_count,
    })),
    commentsCount: commentsCountMap[poll.poll_id] ?? 0,
  }));

  return (
    <main className="container mx-auto max-w-6xl space-y-8 py-8">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 py-20 text-center">
          <Vote className="mb-4 h-10 w-10 text-gray-500" />
          <p className="text-gray-400">Du har inte skapat några polls ännu.</p>
          <Link
            href="/create"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Skapa din första poll
          </Link>
        </div>
      ) : (
        <ContentCard blockTitle="Mina polls" items={items} />
      )}
    </main>
  );
}
