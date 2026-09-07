"use client";

import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Category, StoreSettings } from "@/lib/types";

export function Footer({ settings, categories }: { settings: StoreSettings; categories: Category[] }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="mt-16 bg-[#211b1d] text-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-md bg-white px-3 py-2">
            <Image src="/logo.png" width={180} height={53} alt={settings.storeName} className="h-auto w-40" />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-stone-400">
            Traditional Burmese achar, handmade in small batches with carefully selected ingredients and lots of love.
          </p>
          <div className="mt-5 flex gap-3">
            <a className="rounded-full border border-white/20 p-2" href="#" aria-label="Facebook">
              <MessageCircle size={16} />
            </a>
            <a className="rounded-full border border-white/20 p-2" href="#" aria-label="Instagram">
              <Camera size={16} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">Shop</h3>
          <div className="flex flex-col gap-3 text-sm text-stone-400">
            {categories.slice(0, 5).map((category) => (
              <Link key={category._id} href={`/category/${category.slug}`} className="hover:text-white">
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">Customer care</h3>
          <div className="flex flex-col gap-3 text-sm text-stone-400">
            <Link href="/track-order">Track your order</Link>
            <Link href="/account/orders">Order history</Link>
            <Link href="/dashboard" className="text-purple-300 font-semibold hover:text-white">
              Merchant Dashboard
            </Link>
            <Link href="/policies/returns">Returns & exchanges</Link>
            <Link href="/policies/privacy">Privacy policy</Link>
            <Link href="/policies/terms">Terms & conditions</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-widest">Contact</h3>
          <div className="space-y-4 text-sm text-stone-400">
            <p className="flex gap-3">
              <Phone size={17} className="shrink-0" />
              {settings.phone}
            </p>
            <p className="flex gap-3">
              <Mail size={17} className="shrink-0" />
              {settings.email}
            </p>
            <p className="flex gap-3">
              <MapPin size={17} className="shrink-0" />
              {settings.address}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
      </div>
    </footer>
  );
}
