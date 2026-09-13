"use client";

import { ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { formatEmailLink, formatMapLink, formatPhoneForTel, formatWhatsAppLink } from "@/lib/contact";
import type { Category, StoreSettings } from "@/lib/types";

export function Header({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const links = [
    ["Home", "/"],
    ["All Products", "/products"],
    ["Offers", "/products?sort=sale"],
    ["Track Order", "/track-order"],
    ["Contact", "/contact"],
    // ["Dashboard", "/dashboard"],
  ];

  const logoSrc = settings.logo || "/logo.png";
  const whatsappUrl = formatWhatsAppLink(settings.whatsapp, `Hi ${settings.storeName}, I would like to make an inquiry.`);
  const phoneUrl = formatPhoneForTel(settings.phone);
  const emailUrl = formatEmailLink(settings.email);
  const mapUrl = formatMapLink(settings.address, settings.googleMapsUrl);

  return (
    <>
      <div className="bg-[#261d20] px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs">
        {settings.announcement}
      </div>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="container-shell flex h-[70px] items-center gap-4 lg:h-[78px]">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={23} />
          </button>
          <Link href="/" className="relative mr-auto h-10 w-[136px] shrink-0 lg:mr-5 lg:h-12 lg:w-[164px]" aria-label={`${settings.storeName} home`}>
            <Image src={logoSrc} alt={settings.storeName} fill priority sizes="164px" className="object-contain object-left" />
          </Link>
          <nav className="hidden items-center gap-6 text-[13px] font-bold lg:flex">
            {links.slice(0, 2).map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "text-[#6f2742]" : "hover:text-[#6f2742]"}>
                {label}
              </Link>
            ))}
            <div className="group relative py-7">
              <button className="flex items-center gap-1 font-bold">
                Categories <ChevronDown size={14} />
              </button>
              <div className="invisible absolute left-0 top-full w-56 translate-y-2 border border-stone-200 bg-white py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {categories.map((category) => (
                  <Link key={category._id} href={`/category/${category.slug}`} className="block px-4 py-2.5 text-sm hover:bg-stone-50 hover:text-[#6f2742]">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            {links.slice(2).map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "text-[#6f2742]" : "hover:text-[#6f2742]"}>
                {label}
              </Link>
            ))}
          </nav>
          <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 justify-end md:flex lg:max-w-[290px]">
            <div className="relative w-full">
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full border border-stone-200 bg-stone-50 pl-4 pr-11 text-sm outline-none focus:border-[#6f2742]" placeholder="Search products..." />
              <button aria-label="Search" className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center">
                <Search size={18} />
              </button>
            </div>
          </form>
          <button className="md:hidden" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}>
            <Search size={21} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden sm:block">
            <UserRound size={21} />
          </Link>
          <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative">
            <ShoppingBag size={22} />
            <span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f2742] px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          </Link>
        </div>
        {searchOpen && (
          <form onSubmit={submitSearch} className="container-shell pb-3 md:hidden">
            <div className="relative">
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className="field pr-11" placeholder="Search products..." />
              <button className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center">
                <Search size={18} />
              </button>
            </div>
          </form>
        )}
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="relative h-10 w-36">
                <Image src={logoSrc} alt={settings.storeName} fill sizes="160px" className="object-contain object-left" />
              </div>
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>
            <nav className="mt-3 flex flex-col">
              {links.map(([label, href]) => (
                <Link onClick={() => setMenuOpen(false)} key={href} href={href} className="border-b border-stone-100 py-3 text-sm font-semibold">
                  {label}
                </Link>
              ))}
              <p className="eyebrow mb-2 mt-5">Categories</p>
              {categories.map((category) => (
                <Link onClick={() => setMenuOpen(false)} key={category._id} href={`/category/${category.slug}`} className="py-2 text-sm text-stone-600">
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Contact & Support Section */}
            <div className="mt-auto border-t border-stone-200 pt-5">
              <p className="eyebrow mb-3">Helpline & Support</p>
              <div className="space-y-2.5 text-xs text-stone-700">
                {settings.phone && (
                  <a href={phoneUrl} className="flex items-center gap-2.5 font-medium hover:text-[#6f2742]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8ec] text-[#6f2742]">
                      <Phone size={13} />
                    </span>
                    <span>{settings.phone}</span>
                  </a>
                )}
                {settings.whatsapp && (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 font-medium text-emerald-700 hover:text-emerald-800">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <MessageCircle size={13} />
                    </span>
                    <span>WhatsApp Chat</span>
                  </a>
                )}
                {settings.email && (
                  <a href={emailUrl} className="flex items-center gap-2.5 font-medium hover:text-[#6f2742]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3e8ec] text-[#6f2742]">
                      <Mail size={13} />
                    </span>
                    <span className="truncate">{settings.email}</span>
                  </a>
                )}
                {settings.address && (
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 font-medium text-stone-500 hover:text-stone-800">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                      <MapPin size={13} />
                    </span>
                    <span className="line-clamp-2 text-[11px] leading-4">{settings.address}</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
