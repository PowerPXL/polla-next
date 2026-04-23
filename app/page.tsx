import ContentCard from "@/components/ContentCard";
import ContentBlock from "@/components/ContentBlock";

const dummyPolls = [
  {
    id: "1",
    title: "Vem vill du se som statsminister i Sverige 2026",
    slug: "polla.se/Vem-vill-du-se-som-statsminister-i-sverige-2025",
    options: [
      { id: "a", text: "Magdalena Andersson (S)", votes: 15 },
      { id: "b", text: "Ulf Kristersson (M)", votes: 22 },
      { id: "c", text: "Jimmie Åkesson (SD)", votes: 33 },
      { id: "d", text: "Ebba Busch (KD)", votes: 3 },
      { id: "e", text: "Elisabeth Thand Ringqvist (C)", votes: 3 },
      { id: "f", text: "Amanda Lind/Daniel Helldén (MP)", votes: 3 },
      { id: "g", text: "Nooshi Dadgostar (V)", votes: 3 },
      { id: "h", text: "Simona Mohamsson (L)", votes: 3 },
        ],
    commentsCount: 12,
  },
  {
    id: "2",
    title: "Konflikten Israel/Palestina",
    slug: "polla.se/konflikten-israel-palestina",
    options: [
      { id: "a", text: "Palestina", votes: 28 },
      { id: "b", text: "Israel", votes: 19 },
    ],
    commentsCount: 45,  
  },
  {
    id: "3",
    title: "Vilken valuta vill du se i Sverige?",
    slug: "movie-poll",
    options: [
      { id: "a", text: "EURO", votes: 33 },
      { id: "b", text: "SEK", votes: 52 },
    ],
    commentsCount: 28,
  },
];
                                          [/*Layout* */]
export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl">
      <ContentBlock title="- ÄR UNDER UPPBYGGNAD | Tjänsten Polla.se är ej i drift -">
        <p>Bestäm tillsammans. Skapa röstningar gratis -utan inlogg.</p>
      </ContentBlock>
      <ContentCard
        blockTitle="Populära"
        items={dummyPolls}
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
        </p></div>
      </ContentBlock>
    </main>
  );
}