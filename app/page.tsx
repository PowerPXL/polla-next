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

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-6 max-w-6xl">
      <ContentBlock
        title="- ÄR UNDER UPPBYGGNAD | Tjänsten Polla.se är ej i drift -"
        text="Bestäm tillsammans. Skapa röstningar gratis -utan inlogg."
      />
      
      <ContentCard
        blockTitle="Populära"
        items={dummyPolls}
      />
    </main>
  );
}