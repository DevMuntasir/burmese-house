"use client";

import { Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { discountPercent, formatPrice, productPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useEffect, useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const discount = discountPercent(product.regularPrice, product.salePrice);
  const soldOut = product.stockQuantity <= 0 && !product.variants?.some((variant) => variant.active && variant.stock > 0);
  const quickAdd = () => {
    if (product.variants?.length) return;
    addItem({ id: product._id, productId: product._id, slug: product.slug, title: product.title, image: product.images[0], price: productPrice(product.regularPrice, product.salePrice), quantity: 1, sku: product.sku, maxStock: product.stockQuantity });
  };
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("burmese-house-wishlist") || "[]") as string[];
    setWishlisted(saved.includes(product._id));
  }, [product._id]);
  const toggleWishlist = () => {
    const saved = JSON.parse(localStorage.getItem("burmese-house-wishlist") || "[]") as string[];
    const next = saved.includes(product._id) ? saved.filter((id) => id !== product._id) : [...saved, product._id];
    localStorage.setItem("burmese-house-wishlist", JSON.stringify(next));
    setWishlisted(next.includes(product._id));
  };

  return (
    <article className="group min-w-0 overflow-hidden rounded-[16px] border border-[#eeeeee] bg-white p-2 shadow-[0_3px_18px_rgba(20,20,20,.035)] sm:rounded-[20px] sm:p-2.5">
      <div className="relative aspect-[1/1.08] overflow-hidden rounded-[13px] bg-[#f4f4f4] sm:aspect-[4/5] sm:rounded-[16px]">
        <Link href={`/products/${product.slug}`} aria-label={product.title}>
          <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
        </Link>
        {discount > 0 && <span className="absolute left-2 top-2 rounded-full bg-[#ff464b] px-2.5 py-1 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:text-[11px]">-{discount}%</span>}
        {product.isNewArrival && !discount && <span className="absolute left-2 top-2 rounded-full bg-[#ff464b] px-2.5 py-1 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:text-[11px]">NEW</span>}
        <button type="button" onClick={toggleWishlist} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#ededed] bg-white/95 text-[#ff464b] shadow-sm sm:right-3 sm:top-3 sm:h-9 sm:w-9"><Heart size={16} fill={wishlisted ? "currentColor" : "none"} /></button>
        {soldOut && <div className="absolute inset-0 flex items-center justify-center bg-white/60"><span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Out of stock</span></div>}
        {!soldOut && <button onClick={product.variants?.length ? undefined : quickAdd} className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#ff464b] text-white shadow-[0_4px_12px_rgba(255,70,75,.35)] transition hover:scale-105 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100" aria-label={`Add ${product.title} to cart`}>
          {product.variants?.length ? <Link href={`/products/${product.slug}`} className="flex h-full w-full items-center justify-center"><ShoppingBag size={16} /></Link> : <ShoppingBag size={16} />}
        </button>}
      </div>
      <div className="px-1 pb-1 pt-2.5 sm:px-1.5 sm:pb-2 sm:pt-3">
        <div className="flex items-center justify-between gap-2"><Link href={`/category/${product.category.slug}`} className="truncate text-[9px] font-medium text-[#999] sm:text-[11px]">{product.category.name}</Link><span className="flex shrink-0 items-center gap-1 text-[9px] text-[#777] sm:text-[11px]"><Star size={11} fill="#ffad1f" strokeWidth={0} /> 4.{(product.soldCount ?? 5) % 5 + 5}</span></div>
        <h3 className="mt-1.5 line-clamp-2 min-h-9 text-[12px] font-semibold leading-[18px] sm:min-h-10 sm:text-[15px] sm:leading-5"><Link href={`/products/${product.slug}`} className="hover:text-[#ff464b]">{product.title}</Link></h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5"><span className="text-[13px] font-extrabold text-[#ff464b] sm:text-base">{formatPrice(productPrice(product.regularPrice, product.salePrice))}</span>{product.salePrice && <span className="text-[9px] text-stone-400 line-through sm:text-xs">{formatPrice(product.regularPrice)}</span>}</div>
      </div>
    </article>
  );
}
