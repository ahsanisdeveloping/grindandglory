import type { Metadata } from "next";
import { Alfa_Slab_One, Geist } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const alfaSlab = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  weight: "400",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Grind&Glory | We do the grind. You get the glory.",
  description: site.description,
  applicationName: site.name,
  icons: { icon: "/images/brand/icon.png", apple: "/images/brand/icon.png" },
  openGraph: {
    title: "Grind&Glory",
    description: site.description,
    type: "website",
    images: [
      {
        url: "/images/brand/social.jpg",
        width: 1200,
        height: 630,
        alt: "Grind&Glory crown and controller brand mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grind&Glory",
    description: site.description,
    images: ["/images/brand/social.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${alfaSlab.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
