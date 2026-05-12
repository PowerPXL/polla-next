import { createClient } from "@/lib/supabase/server";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookHeart, ChevronRight, BarChart2 } from 'lucide-react';

export default async function FavoritesPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: saved, error } = await supabase
    .from('saved_polls')
    .select(`
      id,
      created_at,
      poll (
        id,
        title,
        question,
        created_at,
        poll_votes (id),
        poll_opt (id)
      )
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <BookHeart className="h-6 w-6 text-gray-300" />
        <h1 className="text-2xl font-semibold text-white">Favoriter</h1>
      </div>

      {!saved || saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-600 py-20 text-center">
          <BookHeart className="mb-4 h-10 w-10 text-gray-500" />
          <p className="text-gray-400">Du har inte sparat några polls ännu.</p>
          <Link
            href="/"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Utforska polls
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {saved.map((entry) => {
            const poll = Array.isArray(entry.poll) ? entry.poll[0] : entry.poll;
            if (!poll) return null;
            return (
              <li key={entry.id}>
                <Link
                  href={`/poll/${poll.id}`}
                  className="flex items-center justify-between rounded-xl bg-[#374151] px-5 py-4 hover:bg-[#3f4d5e] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-white">{poll.question ?? poll.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BarChart2 className="h-3 w-3" />
                        {poll.poll_votes?.length ?? 0} röster
                      </span>
                      <span>{poll.poll_opt?.length ?? 0} alternativ</span>
                      <span>
                        Sparad {new Date(entry.created_at).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="ml-4 h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-gray-300 transition-colors" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
