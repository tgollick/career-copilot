import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/layout/Footer";
import { Figtree } from "next/font/google"
import { Toaster } from "sonner";

const figtree = Figtree({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Career Co-Pilot - AI-Powered Job Matching Platform",
  description:
    "Transform your job search with AI. Upload your CV, get personalized job matches, and find opportunities that fit your skills perfectly.",
  keywords: [
    "job search",
    "career matching",
    "AI recruitment",
    "CV analysis",
    "job matching platform",
    "career development",
    "job finder",
    "resume optimization",
  ],
  authors: [{ name: "Thomas Gollick" }],
  creator: "Thomas Gollick",
  openGraph: {
    title: "Career Co-Pilot - AI-Powered Job Matching",
    description:
      "Stop searching for jobs. Let jobs find you. AI-powered platform that matches your skills with perfect opportunities.",
    // url: "https://your-domain.com", // Replace with your actual URL
    siteName: "Career Co-Pilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Co-Pilot - AI Job Matching Platform",
    description:
      "Transform your job search with intelligent CV analysis and personalized job recommendations.",
    creator: "@tgollick",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-verification-code", // Add when you get Google Search Console setup
  // },
  category: "technology",
  classification: "Career Development Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${figtree.className} antialiased`}
        >
          <Header />
          {children}
          <Footer />
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
