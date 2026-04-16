import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t border-zinc-200 bg-white py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-bold mb-4">Polla.se</div>
            <p className="text-sm text-zinc-600 mb-4">
              Skapa polls gratis utan inlogg, opinionsundersökningar snabbt och enkelt. Bestäm tillsammans! 
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sitemap</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="/kontakt" className="hover:text-blue-600 transition-colors">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Följ oss</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">X</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">TikTok</Link></li>
              </ul>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Drivs avPavent.
        </div>
      </div>
    </footer>
  );
}