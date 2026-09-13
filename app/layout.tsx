import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/cart-provider";
import { FloatingCart } from "@/components/cart/floating-cart";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StoreJsonLd } from "@/components/seo/structured-data";
import { getCategories, getStoreSettings } from "@/lib/sanity/data";
import { getBaseUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getBaseUrl();

export const viewport: Viewport = {
  themeColor: "#ff464b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Burmese House — আসল বার্মিজ আচারের স্বাদ",
    template: "%s | Burmese House",
  },
  description:
    "ঘরে তৈরি আম, তেঁতুল ও চিলি গার্লিক বার্মিজ আচার এবং স্পেশাল চাটনি—শতভাগ প্রিমিয়াম মান ও সারাদেশে ক্যাশ অন হোম ডেলিভারি।",
  applicationName: "Burmese House",
  authors: [{ name: "Burmese House", url: siteUrl }],
  creator: "Burmese House",
  publisher: "Burmese House",
  category: "Food & Beverage",
  keywords: [
    "Burmese House",
    "বার্মিজ আচার",
    "আসল বার্মিজ আচার",
    "আমের আচার",
    "তেঁতুলের আচার",
    "চিলি গার্লিক আচার",
    "Burmese Mango Chutney",
    "Tamarind Chutney",
    "Chili Garlic Chutney",
    "Burmese achar bd",
    "Pickle Bangladesh",
    "Homemade achar Dhaka",
    "আচার অনলাইন শপ",
    "চাটনি ডেলিভারি",
    "বার্মিজ খাবার",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "Burmese House",
    title: "Burmese House — আসল বার্মিজ আচারের স্বাদ",
    description:
      "ঘরে তৈরি আম, তেঁতুল ও চিলি গার্লিক বার্মিজ আচার—সারাদেশে হোম ডেলিভারি।",
    images: [
      {
        url: "/images/hero-chutney.png",
        width: 1200,
        height: 630,
        alt: "Burmese House - Authentic Burmese Achar & Chutney",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burmese House — আসল বার্মিজ আচারের স্বাদ",
    description:
      "ঘরে তৈরি আম, তেঁতুল ও চিলি গার্লিক বার্মিজ আচার—সারাদেশে হোম ডেলিভারি।",
    images: ["/images/hero-chutney.png"],
    creator: "@BurmeseHouse",
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <html lang="bn">
      <body>
        <StoreJsonLd settings={settings} />
        <CartProvider>
          <Header settings={settings} categories={categories} />
          <main className="min-h-[65vh]">{children}</main>
          <FloatingCart />
          <FloatingWhatsApp settings={settings} />
          <Footer settings={settings} categories={categories} />
          <Toaster richColors position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}

