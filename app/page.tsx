import { createClient } from "@/lib/supabase/server";
import ContentCard from "@/components/ContentCard";
import ContentBlock from "@/components/ContentBlock";

export default async function Home() {
  const supabase = await createClient();

  const { data: polls } = await supabase
    .from("poll")
    .select(`
      poll_id,
      title,
      slug,
      poll_opt (
        opt_id,
        title,
        vote_count
      )
    `)
    .eq("featured", true)
    .limit(3);

  const featuredPolls = (polls ?? []).map((poll) => ({
    id: String(poll.poll_id),
    title: poll.title,
    slug: poll.slug,
    options: poll.poll_opt.map((opt) => ({
      id: String(opt.opt_id),
      text: opt.title,
      votes: opt.vote_count,
    })),
    commentsCount: 0,
  }));

  return (
    <main className="container mx-auto max-w-6xl">
      <ContentBlock title="Bestäm tillsammans. Skapa röstningar gratis - utan inlogg.">
        <p>Röstning är helt anonym och kopplas inte till person</p>
      </ContentBlock>
      <ContentCard
        blockTitle="Populära"
        items={featuredPolls}
      />

      <ContentBlock title="Tillförlitliga och träffsäkra omröstningar online Polla.se">
        <div className="text-xs space-y-4">
          <p>
            Produkten bakom Polla.se bygger på en algoritm som är utvecklad för att detektera och motverka manipulation i omröstningar. Genom att analysera röstningsmönster i realtid kan systemet identifiera avvikande beteenden som kan indikera ogiltig eller manipulerad aktivitet, såsom automatiserade röster, onormala röstningsfrekvenser eller upprepade mönster från samma användare.
          </p>
          <p>
            Vi strävar efter att säkerställa hög riktighet och träffsäkerhet i våra omröstningar. Samtidigt är det viktigt att vara transparent med att alla digitala undersökningar innehåller en viss felkälla. Felmarginalen uppskattas i dagsläget till cirka 2–3 % och beaktas i samtliga publika omröstningar.
          </p>
          <p>
            Genom dessa åtgärder strävar vi efter att resultaten ska spegla användarnas faktiska åsikter så korrekt som möjligt, samtidigt som vi kontinuerligt förbättrar våra metoder för att ytterligare stärka tillförlitligheten.
          </p>
        </div>
      </ContentBlock>
    </main>
  );
}