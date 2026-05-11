// app/category/[slug]/page.tsx (server)
import { createClient } from "@/lib/supabase/server";
import ContentCard from "@/components/ContentCard";
import ContentBlock from "@/components/ContentBlock";


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

  // ... samma commentCounts-logik som Home ...
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
    <main className="container mx-auto max-w-6xl">
      <ContentBlock title={`${category} – Alla omröstningar`}>
        <p className="text-lg">Pollar inom {category}</p>
      </ContentBlock>
      <ContentCard blockTitle={`${category} Pollar`} items={categoryPolls} />
    </main>
  );
}