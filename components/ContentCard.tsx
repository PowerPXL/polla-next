"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Users, ArrowRight } from "lucide-react";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type CardItem = {
  id: string;
  title: string;
  slug: string;
  poll_type: "local" | "global" | null;
  category: string | null;
  options: PollOption[];
  commentsCount: number;
};

export default function ContentCard({
  blockTitle,
  items,
}: {
  blockTitle: string;
  items: CardItem[];
}) {
  const router = useRouter();

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{blockTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-start">
        {items.map((item) => {
          // Totalen räknas på ALLA alternativ, inte bara de två som visas
          const total = item.options.reduce((sum, o) => sum + o.votes, 0);

          // Sortera störst först topp 2
          const topOptions = [...item.options]
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 2);

          const hiddenCount = item.options.length - topOptions.length;

          return (
            <div
              key={item.id}
              onClick={() => router.push(`/poll/${item.slug}`)}
              className="group relative bg-white border border-gray-200 p-4 space-y-2 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-md"
            >
              {/* Header */}
              <div className="space-y-2">
                {item.poll_type || item.category ? (
                  <div className="flex items-center gap-1">
                    {item.category ? (
                      <Link
                        href={`/category/${item.category.toLowerCase()}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        {item.category}
                      </Link>
                    ) : null}

                    {/* Röstantal */}
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
                      {item.poll_type === "global" ? (
                        <Globe className="h-3 w-3 text-yellow-500" aria-label="Global" />
                      ) : item.poll_type === "local" ? (
                        <Users className="h-3 w-3 text-gray-500" aria-label="Lokal" />
                      ) : null}
                      {total.toLocaleString("sv-SE")} röster
                    </span>
                  </div>
                ) : null}
                    {/* Titel */}
                <div className="h-full flex flex-col">
                  <Link href={`/poll/${item.slug}`} onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-base font-semibold leading-snug line-clamp-3 min-h-[4.5rem]">
                    {item.title}
                  </h3>

                  </Link>
                </div>
              </div>

              {/* Svarsalternativ –*/}
              <div className="space-y-0">
                {topOptions.map((option) => {
                  const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;

                  return (
                    <Link
                      key={option.id}
                      href={`/poll/${item.slug}?option=${option.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full text-left p-3 transition-colors duration-150 hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-gray-900">{option.text}</span>
                        <span className="text-xs font-bold text-gray-800 ml-2 shrink-0">{pct}%</span>
                      </div>
                    </Link>
                  );
                })}

                {hiddenCount > 0 ? (
                  <p className="px-3 pt-2 text-[10px] text-gray-400">
                    +{hiddenCount} fler alternativ
                  </p>
                ) : null}
              </div>

              {/* Footer – hover */}
<div className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-100 opacity-0 max-h-0 overflow-hidden transition-all duration-200 group-hover:opacity-100 group-hover:max-h-24 z-10">
  <div className="flex items-center justify-between px-4 pb-4 pt-2">
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
      </svg>
      <span>{item.commentsCount} kommentarer</span>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={(e) => e.stopPropagation()}
        className="flex items-center space-x-2 text-xs text-gray-500 p-1 -m-1 rounded cursor-pointer hover:text-gray-800"
      >
        {/* dela-knapp här */}
      </button>

      <Link
        href={`/poll/${item.slug}`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Öppna omröstning"
        className="flex items-center text-gray-500 hover:text-blue-600"
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
</div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
