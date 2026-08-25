"use client";

import { ChevronDown, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { Category, StoreSettings } from "@/lib/types";

export function Header({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };
  const links = [
    ["Home", "/"], ["All Products", "/products"], ["Offers", "/products?sort=sale"], ["Track Order", "/track-order"],
  ];

  return (
    <>
      <div className="bg-[#261d20] px-3 py-2 text-center text-[11px] font-semibold tracking-wide text-white sm:text-xs">{settings.announcement}</div>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="container-shell flex h-[70px] items-center gap-4 lg:h-[78px]">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
          <Link href="/" className="relative mr-auto h-10 w-[136px] shrink-0 lg:mr-5 lg:h-12 lg:w-[164px]" aria-label={`${settings.storeName} home`}><Image src="/logo.png" alt={settings.storeName} fill priority sizes="164px" className="object-contain object-left" /></Link>
          <nav className="hidden items-center gap-6 text-[13px] font-bold lg:flex">
            {links.slice(0, 2).map(([label, href]) => <Link key={href} href={href} className={pathname === href ? "text-[#6f2742]" : "hover:text-[#6f2742]"}>{label}</Link>)}
            <div className="group relative py-7">
              <button className="flex items-center gap-1 font-bold">Categories <ChevronDown size={14} /></button>
              <div className="invisible absolute left-0 top-full w-56 translate-y-2 border border-stone-200 bg-white py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {categories.map((category) => <Link key={category._id} href={`/category/${category.slug}`} className="block px-4 py-2.5 text-sm hover:bg-stone-50 hover:text-[#6f2742]">{category.name}</Link>)}
              </div>
            </div>
            {links.slice(2).map(([label, href]) => <Link key={href} href={href} className="hover:text-[#6f2742]">{label}</Link>)}
          </nav>
          <form onSubmit={submitSearch} className="ml-auto hidden min-w-0 flex-1 justify-end md:flex lg:max-w-[290px]">
            <div className="relative w-full"><input value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 w-full border border-stone-200 bg-stone-50 pl-4 pr-11 text-sm outline-none focus:border-[#6f2742]" placeholder="Search products..." /><button aria-label="Search" className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center"><Search size={18} /></button></div>
          </form>
          <button className="md:hidden" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}><Search size={21} /></button>
          <Link href="/account" aria-label="Account" className="hidden sm:block"><UserRound size={21} /></Link>
          <Link href="/cart" aria-label={`Cart with ${itemCount} items`} className="relative"><ShoppingBag size={22} /><span className="absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6f2742] px-1 text-[10px] font-bold text-white">{itemCount}</span></Link>
        </div>
        {searchOpen && <form onSubmit={submitSearch} className="container-shell pb-3 md:hidden"><div className="relative"><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className="field pr-11" placeholder="Search products..." /><button className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center"><Search size={18} /></button></div></form>}
      </header>
      {menuOpen && <div className="fixed inset-0 z-50 bg-black/45 lg:hidden" onClick={() => setMenuOpen(false)}>
        <aside className="h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-stone-200 pb-5"><div className="relative h-11 w-40"><Image src="/logo.png" alt={settings.storeName} fill sizes="160px" className="object-contain object-left" /></div><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X /></button></div>
          <nav className="mt-4 flex flex-col">
            {links.map(([label, href]) => <Link onClick={() => setMenuOpen(false)} key={href} href={href} className="border-b border-stone-100 py-3.5 font-semibold">{label}</Link>)}
            <p className="eyebrow mb-2 mt-7">Categories</p>
            {categories.map((category) => <Link onClick={() => setMenuOpen(false)} key={category._id} href={`/category/${category.slug}`} className="py-2.5 text-sm text-stone-600">{category.name}</Link>)}
          </nav>
        </aside>
      </div>}
    </>
  );
}
