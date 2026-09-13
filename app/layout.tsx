import type { Metadata } from "next";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/cart-provider";
import { FloatingCart } from "@/components/cart/floating-cart";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCategories, getStoreSettings } from "@/lib/sanity/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Burmese House — আসল বার্মিজ আচারের স্বাদ", template: "%s | Burmese House" },
  description: "ঘরে তৈরি আম, তেঁতুল ও চিলি গার্লিক বার্মিজ আচার—সারাদেশে হোম ডেলিভারি।",
  openGraph: { title: "Burmese House", description: "A jar full of Burmese tradition", type: "website", images: ["/images/hero-chutney.png"] },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, categories] = await Promise.all([getStoreSettings(), getCategories()]);
  return (
    <html lang="en">
      <body>
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
