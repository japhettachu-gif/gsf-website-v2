import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["600", "700", "800"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Genius Soccer Foundation — Académie de football à Douala",
    template: "%s — Genius Soccer Foundation",
  },
  description:
    "Académie de football à Douala formant l'élite africaine depuis 2012. Programmes U10-U18, Boot Camp annuel et plateforme de gestion académie.",
  keywords: ["football", "académie", "Douala", "Cameroun", "GSF", "jeunes", "formation"],
  authors: [{ name: "Genius Soccer Foundation" }],
  openGraph: {
    type: "website",
    siteName: "Genius Soccer Foundation",
    locale: "fr_FR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${barlow.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
