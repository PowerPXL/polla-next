"use client";

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

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{blockTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {items.map((item) => {
          const total = totalVotes(item.options);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col items-center text-center gap-1">
                <span className="text-[10px] text-gray-400 font-mono tracking-wide">
                  {item.slug}
                </span>
                <h3 className="font-bold text-xl text-gray-900 leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Alternativ */}
              <div className="space-y-2">
                {item.options.map((option) => {
                  const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;

                  return (
                    <div
                      key={option.id}
                      className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border hover:border-blue-200 border border-transparent transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium text-gray-800 text-sm">{option.text}</span>
                        <span className="text-xs text-gray-400 ml-2 shrink-0">{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-gray-400 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rösta-knapp */}
              <button className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border hover:border-blue-200">
                Rösta
              </button>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
                  </svg>
                  <span>{item.commentsCount} kommentarer</span>
                </div>
                <button className="text-xs text-red-500 font-medium hover:text-red-600 p-1 -m-1 rounded">
                  Rapportera
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}