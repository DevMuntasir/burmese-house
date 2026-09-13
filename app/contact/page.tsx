import type { Metadata } from "next";
import { ContactView } from "@/components/storefront/contact-view";
import { getStoreSettings } from "@/lib/sanity/data";
import { getAbsoluteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const title = `Contact Us — ${settings.storeName}`;
  const description = `Get in touch with ${settings.storeName}. Helpline: ${settings.phone}, WhatsApp: ${settings.whatsapp}, Email: ${settings.email}`;

  return {
    title,
    description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title,
      description,
      url: "/contact",
      type: "website",
      images: [
        {
          url: getAbsoluteUrl("/images/hero-chutney.png"),
          width: 1200,
          height: 630,
          alt: settings.storeName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getAbsoluteUrl("/images/hero-chutney.png")],
    },
  };
}

export default async function ContactPage() {
  const settings = await getStoreSettings();
  return <ContactView settings={settings} />;
}
