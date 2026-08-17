import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ProfileBar from "@/components/ProfileBar"; 
import Footer from "@/components/Footer";
import InfoBanner from '@/components/InfoBanner'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://polla.se"),
  title: {
    default: "Polla.se – Skapa gratis omröstningar online utan inloggning",
    template: "%s | Polla.se",
  },
  description:
    "Skapa och dela omröstningar gratis på svenska. Ingen inloggning krävs – rösta anonymt och se resultatet direkt.",
  openGraph: {
    siteName: "Polla.se",
    locale: "sv_SE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={inter.variable}>
      <body>
        <InfoBanner />
        <div className="min-h-screen flex flex-col">
          <Header />
            <ProfileBar /> 
          <main className="flex-1">
            <div className="mx-auto w-full max-w-5xl px-4 py-4">
              <div className="flex flex-col gap-10 min-h-[60vh]">
                {children}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}