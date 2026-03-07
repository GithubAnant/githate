import type { Metadata } from "next";
import { Instrument_Serif, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Databuddy } from '@databuddy/sdk/react';


const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://githate.anants.studio"),
  title: "GitHate | Track who unfollowed you on GitHub",
  description: "A fast, privacy-first CLI tool to track who unfollowed you on GitHub directly from your terminal.",
  keywords: ["github", "unfollowers", "cli", "tracker", "developer tools", "terminal"],
  authors: [{ name: "Anant Singhal", url: "https://twitter.com/anant_hq" }],
  creator: "Anant Singhal",
  openGraph: {
    title: "GitHate | Track who unfollowed you on GitHub",
    description: "A fast, privacy-first CLI tool to track who unfollowed you on GitHub directly from your terminal.",
    url: "https://githate.anants.studio",
    siteName: "GitHate",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/githate.png",
        width: 800,
        height: 600,
        alt: "GitHate Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHate | Track who unfollowed you on GitHub",
    description: "A fast, privacy-first CLI tool to track who unfollowed you on GitHub directly from your terminal.",
    images: ["/githate.png"],
    creator: "@anant_hq",
  },
  icons: {
    icon: "/githate.png",
    shortcut: "/githate.png",
    apple: "/githate.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${geistMono.variable} ${geist.variable} font-sans antialiased bg-black text-white min-h-screen selection:bg-white/20 selection:text-black`}>
        {children}
        <Databuddy
          clientId="3eeee398-d213-4280-946e-1626040a6785"
          trackInteractions={true}
        />
      </body>
    </html>
  );
}
