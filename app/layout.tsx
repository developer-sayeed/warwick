import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/language-context";
import { DynamicFavicon } from "@/components/dynamic-favicon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const _notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Warwick Restaurant - Our Menu",
  description:
    "Discover our carefully crafted dishes made with the finest ingredients.",

  icons: {
    icon: "https://img.traveltriangle.com/cms/attachments/pictures/1091473/original/1552490121_5c891e8a0066e-thumb.svg?tr=w-606,h-400",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${_geist.variable} ${_notoArabic.variable}`}>
      <body className="font-sans antialiased bg-background">
        <SessionProvider>
          <LanguageProvider>
            <DynamicFavicon />
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="light"
            />
          </LanguageProvider>
        </SessionProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
        {/* Ai Agent Chat */}
        <script src="https://www.noupe.com/embed/019e8200a4ce7049a18aba627245100801ea.js"></script>
      </body>
    </html>
  );
}
