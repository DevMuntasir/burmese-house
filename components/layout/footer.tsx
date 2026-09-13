"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { formatEmailLink, formatMapLink, formatPhoneForTel, formatWhatsAppLink } from "@/lib/contact";
import type { Category, StoreSettings } from "@/lib/types";

export function Footer({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  const logoSrc = settings.logo || "/logo.png";
  const whatsappUrl = formatWhatsAppLink(settings.whatsapp, `Hi ${settings.storeName}, I have a question about my order.`);
  const phoneUrl = formatPhoneForTel(settings.phone);
  const emailUrl = formatEmailLink(settings.email);
  const mapUrl = formatMapLink(settings.address, settings.googleMapsUrl);

  const socialLinks = [
    settings.facebook && { label: "Facebook", href: settings.facebook, icon: FacebookIcon },
    settings.instagram && { label: "Instagram", href: settings.instagram, icon: InstagramIcon },
    settings.tiktok && { label: "TikTok", href: settings.tiktok, icon: TikTokIcon },
    settings.youtube && { label: "YouTube", href: settings.youtube, icon: YouTubeIcon },
    settings.twitter && { label: "Twitter / X", href: settings.twitter, icon: TwitterIcon },
    settings.whatsapp && { label: "WhatsApp", href: whatsappUrl, icon: WhatsAppIcon },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: React.FC<{ className?: string }> }>;

  return (
    <footer className="mt-16 bg-[#211b1d] text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div>
          <div className="inline-flex rounded-md bg-white px-3 py-2">
            <Image src={logoSrc} width={180} height={53} alt={settings.storeName} className="h-auto w-40 object-contain" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-stone-400">
            {settings.footerText || "Traditional Burmese achar, handmade in small batches with carefully selected ingredients and lots of love."}
          </p>

          {/* Social Media Links */}
          {socialLinks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-stone-300 transition duration-200 hover:border-white hover:bg-white/10 hover:text-white hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Shop Categories Column */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-stone-200">Shop</h3>
          <div className="flex flex-col gap-3 text-sm text-stone-400">
            {categories.slice(0, 5).map((category) => (
              <Link key={category._id} href={`/category/${category.slug}`} className="transition hover:text-white">
                {category.name}
              </Link>
            ))}
            <Link href="/products" className="font-semibold text-[#ff8085] transition hover:text-white">
              All Products →
            </Link>
          </div>
        </div>

        {/* Customer Care Column */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-stone-200">Customer care</h3>
          <div className="flex flex-col gap-3 text-sm text-stone-400">
            <Link href="/contact" className="font-medium text-amber-200 transition hover:text-white">
              Contact & Support
            </Link>
            <Link href="/track-order" className="transition hover:text-white">
              Track your order
            </Link>
            <Link href="/account/orders" className="transition hover:text-white">
              Order history
            </Link>
            <Link href="/dashboard" className="font-semibold text-purple-300 transition hover:text-white">
              Merchant Dashboard
            </Link>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-stone-200">Contact</h3>
          <div className="space-y-3.5 text-sm text-stone-400">
            {settings.phone && (
              <a href={phoneUrl} className="group flex items-center gap-3 transition hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-stone-300 transition group-hover:bg-[#6f2742] group-hover:text-white">
                  <Phone size={15} />
                </span>
                <span className="font-medium">{settings.phone}</span>
              </a>
            )}

            {settings.whatsapp && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 transition hover:text-emerald-300">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <MessageCircle size={15} />
                </span>
                <span className="font-medium text-emerald-400 group-hover:text-emerald-300">WhatsApp Chat</span>
              </a>
            )}

            {settings.email && (
              <a href={emailUrl} className="group flex items-center gap-3 transition hover:text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-stone-300 transition group-hover:bg-[#6f2742] group-hover:text-white">
                  <Mail size={15} />
                </span>
                <span className="truncate">{settings.email}</span>
              </a>
            )}

            {settings.address && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 transition hover:text-white">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-stone-300 transition group-hover:bg-[#6f2742] group-hover:text-white">
                  <MapPin size={15} />
                </span>
                <span className="leading-snug">{settings.address}</span>
              </a>
            )}

            {settings.businessHours && (
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-stone-400">
                  <Clock size={14} />
                </span>
                <span>{settings.businessHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
      </div>
    </footer>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.84-4.47V8.6a8.28 8.28 0 0 0 3.93 1.09V6.69z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.031 0C5.396 0 .011 5.385.011 12.019a11.968 11.968 0 0 0 1.602 6.012L0 24l6.169-1.618a11.97 11.97 0 0 0 5.862 1.516h.005c6.634 0 12.02-5.385 12.02-12.02A11.96 11.96 0 0 0 12.031 0zm0 21.879a9.88 9.88 0 0 1-5.041-1.381l-.362-.215-3.741.981.999-3.647-.236-.376A9.873 9.873 0 0 1 2.15 12.02c0-5.45 4.433-9.883 9.886-9.883 2.64 0 5.122 1.028 6.988 2.895 1.867 1.867 2.894 4.349 2.894 6.988 0 5.45-4.434 9.882-9.887 9.882zm5.418-7.397c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}
