// app/category/[slug]/page.tsx (server)
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ContentCard from "@/components/ContentCard";

const CATEGORIES = [
  'SAMHÄLLE', 'POLITIK', 'EKONOMI', 'ARBETE', 'UTBILDNING',
  'FAMILJ', 'HÄLSA', 'KULTUR', 'TECH', 'SPORT', 'MILJÖ'
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  const supabase = await createClient();
  const category = decodeURI(slug).toUpperCase(); 
  
  const { data: polls } = await supabase
    .from("poll")
    .select(`
      poll_id, title, slug, poll_type, category,
      poll_opt!poll_id(opt_id, title, vote_count)
    `)
    .eq("category", category)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // commentCounts
  const pollIds = polls?.map(p => p.poll_id) ?? [];
  const { data: commentCounts } = await supabase
    .from("comments")
    .select("poll_id")
    .in("poll_id", pollIds);

  const commentsCountMap = (commentCounts ?? []).reduce((acc, c) => {
    acc[c.poll_id] = (acc[c.poll_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const categoryPolls = (polls ?? []).map(poll => ({
    id: String(poll.poll_id),
    title: poll.title,
    slug: poll.slug,
    poll_type: poll.poll_type ?? null,
    category: poll.category ?? null,
    options: poll.poll_opt.map(opt => ({
      id: String(opt.opt_id),
      text: opt.title,
      votes: opt.vote_count,
    })),
    commentsCount: commentsCountMap[poll.poll_id] ?? 0,
  }));

  return (
    <main className="container mx-auto max-w-6xl space-y-8 py-8">
      {/* NY! Kategorier som i CreatePoll */}
      <div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${encodeURI(cat.toLowerCase())}`}
              className={`px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer
                ${category === cat
                  ? 'bg-gray-700 text-white ring-1 ring-[#FBBC05]'
                  : 'bg-gray-500 text-white hover:bg-gray-700'
                }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <ContentCard blockTitle={`#${category}`} items={categoryPolls} />
    </main>
  );
}