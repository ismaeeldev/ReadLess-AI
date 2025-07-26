// 'use client';
import { Toaster } from 'sonner';
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
});


export const metadata = {
  title: "ReadLess: AI PDF Summarizer - Get Quick Summaries from Any PDF",
  description: "ReadLess is an intelligent AI-powered tool that quickly and accurately summarizes PDF documents. Convert lengthy PDFs into concise, easy-to-understand summaries, saving you time and enhancing your reading experience. Perfect for students, researchers, and professionals.",
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider >

      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body
          className={`${fontSans.variable} font-sans  antialiased`}
        >
          <div className="relative flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
              <Toaster richColors position="top-center" />
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
