import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Latency Test | Bookchaowalit",
  description: "Ping a URL from the browser.",
  keywords: ["latency-test", "tool"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  openGraph: {
    type: "website",
    title: "Latency Test | Bookchaowalit",
    description: "Ping a URL from the browser.",
    siteName: "Bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* THESIS: turn one browser request into a legible instrument reading.
OWN-WORLD: a midnight packet laboratory with cyan signal marks, amber readouts, and a radar sweep.
STORY: set the target, launch one probe, read the current signal, then inspect the short session log.
FIRST VIEWPORT: target control, average readout, and a visible measure—not a generic form—arrive together.
FORM: measurement labels, ruled panels, signal tracks, and monospaced numerals carry the interface grammar.
SEED: b50f17a7 · assigned direction 6 · operate mode.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
        {children}
      </body>
    </html>
  );
}
