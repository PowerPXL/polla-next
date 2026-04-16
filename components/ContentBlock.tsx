export default function ContentBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <section className="rounded-xl border p-8">
      <h2 className="text-xl font-bold mb-2">
        {title}
      </h2>

      <p className="leading-7 text-gray-600">
        {text}
      </p>
    </section>
  );
}