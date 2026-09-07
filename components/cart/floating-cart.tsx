"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/format";

export function FloatingCart() {
  const { itemCount, subtotal } = useCart();
  const [popping, setPopping] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const pop = () => {
      setPopping(false);
      requestAnimationFrame(() => {
        setPopping(true);
        timer = setTimeout(() => setPopping(false), 480);
      });
    };
    window.addEventListener("cart:item-added", pop);
    return () => {
      window.removeEventListener("cart:item-added", pop);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label={`Open cart with ${itemCount} items, total ${formatPrice(subtotal)}`}
      className="group fixed bottom-4 right-3 z-30 flex min-w-[154px] items-center gap-3 rounded-[18px] border border-stone-200/90 bg-white p-2 pr-2 text-[#211b1d] shadow-[0_12px_35px_rgba(38,29,32,.16)] transition duration-200 hover:-translate-y-0.5 hover:border-[#ffb8ba] hover:shadow-[0_16px_40px_rgba(38,29,32,.2)] sm:bottom-6 sm:right-5 lg:bottom-auto lg:right-0 lg:top-1/2 lg:min-w-[112px] lg:-translate-y-1/2 lg:flex-col lg:gap-2.5 lg:rounded-l-[24px] lg:rounded-r-none lg:border-r-0 lg:px-3 lg:py-5 lg:hover:-translate-y-[52%]"
    >
      <span id="floating-cart-target" className={`relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-b-[15px] rounded-t-[7px] bg-gradient-to-br from-[#ff5b60] to-[#ed353b] text-white shadow-[0_7px_16px_rgba(255,70,75,.28)] lg:mt-2 lg:h-12 lg:w-12 ${popping ? "cart-bag-pop" : ""}`}>
        <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-5 w-7 -translate-x-1/2 rounded-t-full border-[2.5px] border-b-0 border-[#ed353b]" />
        <ShoppingBag size={21} strokeWidth={1.9} />
        <span className="absolute -right-2 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#261d20] px-1 text-[9px] font-extrabold leading-none text-white shadow-sm">{itemCount > 99 ? "99+" : itemCount}</span>
      </span>
      <span className="min-w-0 lg:text-center">
        {/* <span className="block text-[9px] font-extrabold uppercase tracking-[.13em] text-stone-400">Shopping bag</span> */}
        <strong className="mt-0.5 block whitespace-nowrap text-sm font-extrabold tabular-nums text-[#211b1d]">{formatPrice(subtotal)}</strong>
        {/* <span className="mt-1 hidden items-center justify-center gap-1 text-[9px] font-bold text-[#ff464b] lg:flex">View cart <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" /></span> */}
      </span>
    </Link>
  );
}
