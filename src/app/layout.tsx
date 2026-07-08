import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Lead Generation & Growth Marketing Agency UK | Verique",
    template: "%s | Verique",
  },
  description: siteConfig.description,
  icons: {
    icon: "/verique-mark.png",
  },
  openGraph: {
    title: "Verique — Lead Generation & Growth Marketing Agency",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Verique",
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Verique",
  url: siteConfig.url,
  email: siteConfig.email,
  slogan: "Create. Engage. Grow.",
  description:
    "Verique is a UK lead generation and growth marketing company helping businesses generate qualified leads, appointments and customers through Meta advertising, Google advertising, video marketing, website design and conversion optimisation.",
  areaServed: { "@type": "Country", name: "United Kingdom" },
  knowsAbout: [
    "Lead Generation",
    "Meta Advertising",
    "Google Advertising",
    "Video Marketing",
    "Website Design",
    "Conversion Rate Optimisation",
    "CRM Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${bricolage.variable} ${figtree.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-paper text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
