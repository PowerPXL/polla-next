type CardItem = {
  title: string;
  text: string;
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
      <h2 className="text-xl font-bold">
        {blockTitle}
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-xl border p-6 space-y-2">
            
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-gray-600 whitespace-pre-line">
              {item.text}
            </p>

          </div>
        ))}
      </div>

    </section>
  );
}