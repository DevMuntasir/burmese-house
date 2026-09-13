"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatWhatsAppLink } from "@/lib/contact";
import type { StoreSettings } from "@/lib/types";

export function FloatingWhatsApp({ settings }: { settings: StoreSettings }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  if (!settings.whatsapp) return null;

  const whatsappUrl = formatWhatsAppLink(
    settings.whatsapp,
    `Hello ${settings.storeName}! I would like to inquire about products & ordering.`
  );

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${settings.storeName} on WhatsApp`}
      className="group fixed bottom-5 left-4 z-30 flex items-center gap-2.5 rounded-full bg-[#25d366] px-3.5 py-2.5 text-white shadow-[0_8px_24px_rgba(37,211,102,.35)] transition duration-300 hover:scale-105 hover:bg-[#20bd5a] hover:shadow-[0_12px_28px_rgba(37,211,102,.45)] sm:bottom-6 sm:left-6 sm:px-4 sm:py-3"
    >
      <span className="relative flex items-center justify-center">
        <MessageCircle size={22} className="fill-white text-white" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
        </span>
      </span>
      <span className="hidden text-xs font-bold tracking-wide sm:inline">
        WhatsApp Support
      </span>
    </a>
  );
}
