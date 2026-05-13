"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Users } from "lucide-react";

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
  const totalVotes = (options: PollOption[]) =>
    options.reduce((sum, o) => sum + o.votes, 0);

  const [selected, setSelected] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{blockTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {items.map((item) => {
          const total = totalVotes(item.options);
          const selectedOption = selected[item.id] || null;
          const isLoading = loading[item.id] || false;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"

>{/* Header */}
              <div className="space-y-2">
                {(item.poll_type || item.category) ? (
                  <div className="flex items-center gap-1">
                    {item.poll_type === "global" ? (
                      <Globe className="h-3 w-3 text-yellow-500" aria-label="Global" />
                    ) : item.poll_type === "local" ? (
                      <Users className="h-3 w-3 text-gray-500" aria-label="Lokal" />
                    ) : null}
                    {item.category ? (
                      <Link 
                        href={`/category/${item.category.toLowerCase()}`}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 transition-colors"
                      >
                        {item.category}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
                <div className="min-w-0">
                  <Link href={`/poll/${item.slug}`}>
                    <h3 className="font-bold text-xl text-gray-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer">
                      {item.title}
                    </h3>
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                {item.options.map((option) => {
                  const pct =
                    total > 0
                      ? Math.round((option.votes / total) * 100)
                      : 0;

                  const isSelected = selectedOption === option.id;

                  return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setSelected((prev) => ({
                            ...prev,
                            [item.id]: option.id,
                          }))
                        }
                        aria-pressed={isSelected}
                        className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all duration-150
                          ${
                            isSelected
                              ? "bg-blue-50 border-blue-300"
                              : "bg-gray-50 border-gray-200"
                          }`}
                      >
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium text-gray-800 text-sm">
                          {option.text}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 shrink-0">
                          {pct}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            isSelected ? "bg-blue-500" : "bg-gray-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

{/* Rösta */}
            <button
              suppressHydrationWarning
              type="button"
              disabled={!selectedOption || isLoading}
              className={`w-full p-3 rounded-xl border text-sm font-medium transition-all
                ${
                  selectedOption && !isLoading
                    ? "bg-blue-500 text-white border-blue-500 cursor-pointer hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400 border-gray-200"
                }`}
              onClick={async () => {
                if (!selectedOption || isLoading) return;

                setLoading((prev) => ({ ...prev, [item.id]: true }));

                try {
                  // Import the vote action dynamically
                  const { vote } = await import("../app/poll/[slug]/actions");
                  const pollId = parseInt(item.id);
                  const optId = parseInt(selectedOption);

                  const result = await vote(pollId, optId, item.slug);

                  if (result?.redirect) {
                    window.location.href = result.redirect;
                    return;
                  }

                  // Reload to show updated results
                  window.location.reload();
                } catch (error) {
                  console.error("Vote error:", error);
                } finally {
                  setLoading((prev) => ({ ...prev, [item.id]: false }));
                }
              }}
            >
              {isLoading ? "Röstar..." : "Rösta"}
            </button>

{/* Footer */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
{/* Kommentar & Dela */}
          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-2 text-sm text-gray-500 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
              </svg>
              <span>{item.commentsCount} kommentarer</span>
          </div>

        <button className="flex items-center space-x-2 text-xs text-gray-500 p-1 -m-1 rounded cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12v.01M4 12a2 2 0 104 0m-4 0a2 2 0 014 0m10-6v.01M18 6a2 2 0 104 0m-4 0a2 2 0 014 0m0 12v.01M18 18a2 2 0 104 0m-4 0a2 2 0 014 0M8.7 13.3l6.6 3.4m0-9.4l-6.6 3.4"
            />
          </svg>
          <span>Pusha</span>
        </button>
            </div>
           </div>
         </div>
          );
        })}
      </div>
    </section>
  );
}