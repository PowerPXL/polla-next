export default function ContentBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white-100 rounded-2xl border border-gray-300 p-6 my-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>

      <div className="leading-7 text-gray-600 space-y-4">
        {children}
      </div>
    </section>
  );
}