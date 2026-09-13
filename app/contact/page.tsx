import type { Metadata } from "next";
import { ContactView } from "@/components/storefront/contact-view";
import { getStoreSettings } from "@/lib/sanity/data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    title: `Contact Us — ${settings.storeName}`,
    description: `Get in touch with ${settings.storeName}. Helpline: ${settings.phone}, WhatsApp: ${settings.whatsapp}, Email: ${settings.email}`,
  };
}

export default async function ContactPage() {
  const settings = await getStoreSettings();
  return <ContactView settings={settings} />;
}
