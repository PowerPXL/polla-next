"use client";

import { useState } from "react";

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type CardItem = {
  id: string;
  title: string;
  slug: string;
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

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{blockTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {items.map((item) => {
          const total = totalVotes(item.options);
          const selectedOption = selected[item.id] || null;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
            >
              <div className="flex flex-col items-start text-left gap-1">
                <span className="text-[10px] text-gray-400 font-mono tracking-wide">
                  {item.slug}
                </span>
                <h3 className="font-bold text-xl text-gray-900 leading-snug">
                  {item.title}
                </h3>
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

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 cursor-pointer">
                  {item.commentsCount} kommentarer
                </div>

                <button className="text-xs text-gray-500 p-1 -m-1 rounded cursor-pointer">
                  Dela
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}