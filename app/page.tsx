import ContentCard from "@/components/ContentCard";
import ContentBlock from "@/components/ContentBlock";

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      
      <ContentBlock
          title="- ÄR UNDER UPPBYGGNAD | Tjänsten Polla.se är ej i drift -"
          text="Bestäm tillsammans. Skapa röstningar gratis -utan inlogg."
      />
      
            <ContentCard
        blockTitle="INSTALL the COPY and RUN"
        items={[
          {
            title: "Question",
            text: "Svar",
          },
          {
            title: "Question",
            text: "svar",
          },
          {
            title: "Question",
            text: "svar",
          },
        ]}
      />

    </main>
  );
}