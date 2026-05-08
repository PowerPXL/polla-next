export default function ContentBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white-100 rounded-2xl border border-gray-300 p-6 my-8">
      
      <h2 className="text-4xl font-bold mb-2">
        {title}
      </h2>

      {subtitle && (
        <p className="text-lg text-gray-800 mb-4">
          {subtitle}
        </p>
      )}

      <div className="leading-7 text-gray-600 space-y-4">
        {children}
      </div>
    </section>
  );
}