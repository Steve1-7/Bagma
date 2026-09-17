import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';
import ToastProvider from '@/components/ui/toast-provider';
import PwaInstall from '@/components/pwa/pwa-install';
import ServiceWorkerRegister from '@/components/pwa/service-worker-register';

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Bagma Lifestyle | Chisanyama & Carwash",
    template: "%s | Bagma Lifestyle",
  },
  description: "Eat, wash, chill and repeat at Bagma Lifestyle: a connected chisanyama, carwash and lifestyle experience.",
  keywords: ["Bagma Lifestyle", "Chisanyama", "Carwash", "Food", "Events"],
  authors: [{ name: "Bagma Lifestyle" }],
  openGraph: {
    title: "Bagma Lifestyle | Chisanyama & Carwash",
    description: "One destination for fire-grilled food, clean rides and the moments that turn a visit into a tradition.",
    type: "website",
    siteName: "Bagma Lifestyle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bagma Lifestyle | Chisanyama & Carwash",
    description: "Eat. Wash. Chill. Repeat.",
  },
  icons: { icon: "/logo5.png", apple: "/logo5.png" },
  appleWebApp: {
    capable: true,
    title: 'Bagma Lifestyle',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <ToastProvider />
        <PwaInstall />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
