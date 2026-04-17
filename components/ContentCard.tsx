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
  return (
    <section className="space-y-6">
      {/* Block title */}
      <h2 className="text-2xl font-bold text-gray-900">
        {blockTitle}
      </h2>

      {/* Cards and Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 p-6 space-y-4">
            
            {/* Header: Titel + Slug */}
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-xl text-gray-900 leading-tight">
                {item.title}
              </h3>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                /{item.slug}
              </span>
            </div>

            {/* Svar-alternativ */}
            <div className="space-y-2">
              {item.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-blue-400">
                    <div className="w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((option.votes / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{option.votes} röster</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rösta-knapp */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
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
        ))}
      </div>
    </section>
  );
}