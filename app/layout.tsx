import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Polla.se",
    template: "%s | ",
  },
  description: "Rösta och skapa omröstningar Gratis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
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