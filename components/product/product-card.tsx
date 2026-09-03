"use client";

import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { discountPercent, formatPrice, productPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const availableVariants = product.variants?.filter((variant) => variant.active) ?? [];
  const firstAvailableVariant = availableVariants.find((variant) => variant.stock > 0);
  const [variantKey, setVariantKey] = useState(firstAvailableVariant?._key ?? availableVariants[0]?._key ?? "");
  const [quantity, setQuantity] = useState(1);
  const selectedVariant = availableVariants.find((variant) => variant._key === variantKey);
  const productImage = product.images?.[0] ?? "/images/hero-chutney.png";
  const categoryName = product.category?.name ?? "Uncategorized";
  const discount = discountPercent(product.regularPrice, product.salePrice);
  const stock = availableVariants.length > 0 ? (selectedVariant?.stock ?? 0) : product.stockQuantity;
  const price = productPrice(product.regularPrice, product.salePrice) + (selectedVariant?.priceAdjustment ?? 0);
  const soldOut = stock <= 0;
  const animateToCart = () => {
    const source = imageAreaRef.current;
    const target = document.getElementById("floating-cart-target");
    const sourceImage = source?.querySelector("img");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!source || !sourceImage || !target || reduceMotion) {
      window.dispatchEvent(new Event("cart:item-added"));
      return;
    }

    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    const thumbnailSize = Math.min(72, start.width * 0.34);
    const startLeft = start.left + start.width / 2 - thumbnailSize / 2;
    const startTop = start.top + start.height / 2 - thumbnailSize / 2;
    const endLeft = end.left + end.width / 2 - thumbnailSize / 2;
    const endTop = end.top + end.height / 2 - thumbnailSize / 2;
    const flyingImage = sourceImage.cloneNode(true) as HTMLImageElement;
    Object.assign(flyingImage.style, {
      position: "fixed",
      left: `${startLeft}px`,
      top: `${startTop}px`,
      width: `${thumbnailSize}px`,
      height: `${thumbnailSize}px`,
      objectFit: "cover",
      border: "3px solid white",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "100",
      boxShadow: "0 12px 28px rgba(33, 27, 29, .24)",
    });
    document.body.appendChild(flyingImage);

    const animation = flyingImage.animate([
      { left: `${startLeft}px`, top: `${startTop}px`, opacity: 1, transform: "scale(.78) rotate(0deg)" },
      { left: `${startLeft + (endLeft - startLeft) * 0.55}px`, top: `${startTop + (endTop - startTop) * 0.42 - 85}px`, opacity: 1, transform: "scale(1) rotate(7deg)", offset: 0.52 },
      { left: `${endLeft}px`, top: `${endTop - 12}px`, opacity: 0.92, transform: "scale(.48) rotate(15deg)", offset: 0.88 },
      { left: `${endLeft}px`, top: `${endTop + 7}px`, opacity: 0, transform: "scale(.12) rotate(18deg)" },
    ], { duration: 760, easing: "cubic-bezier(.22,.72,.2,1)", fill: "forwards" });

    animation.onfinish = () => {
      flyingImage.remove();
      window.dispatchEvent(new Event("cart:item-added"));
    };
    animation.oncancel = () => flyingImage.remove();
  };
  const addToCart = () => {
    if (soldOut) return;
    addItem({
      id: `${product._id}:${selectedVariant?._key ?? "default"}`,
      productId: product._id,
      slug: product.slug,
      title: product.title,
      image: selectedVariant?.image ?? productImage,
      price,
      quantity,
      variantKey: selectedVariant?._key,
      variantTitle: selectedVariant?.title,
      sku: selectedVariant?.sku ?? product.sku,
      maxStock: stock,
    });
    animateToCart();
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
      <div ref={imageAreaRef} className="relative aspect-[1/1.08] overflow-hidden rounded-[13px] bg-[#f4f4f4] sm:aspect-[4/5] sm:rounded-[16px]">
        <Link href={`/products/${product.slug}`} aria-label={product.title}>
          <Image src={productImage} alt={product.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
        </Link>
        {discount > 0 && <span className="absolute left-2 top-2 rounded-full bg-[#ff464b] px-2.5 py-1 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:text-[11px]">-{discount}%</span>}
        {product.isNewArrival && !discount && <span className="absolute left-2 top-2 rounded-full bg-[#ff464b] px-2.5 py-1 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:text-[11px]">NEW</span>}
        <button type="button" onClick={toggleWishlist} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#ededed] bg-white/95 text-[#ff464b] shadow-sm sm:right-3 sm:top-3 sm:h-9 sm:w-9"><Heart size={16} fill={wishlisted ? "currentColor" : "none"} /></button>
        {soldOut && <div className="absolute inset-0 flex items-center justify-center bg-white/60"><span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider">Out of stock</span></div>}
      </div>
      <div className="px-1 pb-1 pt-2.5 sm:px-1.5 sm:pb-2 sm:pt-3">
        <div className="flex items-center justify-between gap-2">{product.category?.slug ? <Link href={`/category/${product.category.slug}`} className="truncate text-[9px] font-medium text-[#999] sm:text-[11px]">{categoryName}</Link> : <span className="truncate text-[9px] font-medium text-[#999] sm:text-[11px]">{categoryName}</span>}<span className="flex shrink-0 items-center gap-1 text-[9px] text-[#777] sm:text-[11px]"><Star size={11} fill="#ffad1f" strokeWidth={0} /> 4.{(product.soldCount ?? 5) % 5 + 5}</span></div>
        <h3 className="mt-1.5 line-clamp-2 min-h-9 text-[12px] font-semibold leading-[18px] sm:min-h-10 sm:text-[15px] sm:leading-5"><Link href={`/products/${product.slug}`} className="hover:text-[#ff464b]">{product.title}</Link></h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5"><span className="text-[13px] font-extrabold text-[#ff464b] sm:text-base">{formatPrice(price)}</span>{product.salePrice && <span className="text-[9px] text-stone-400 line-through sm:text-xs">{formatPrice(product.regularPrice + (selectedVariant?.priceAdjustment ?? 0))}</span>}</div>
        {availableVariants.length > 0 && <label className="mt-2 block">
          <span className="sr-only">Choose an option for {product.title}</span>
          <select
            value={variantKey}
            onChange={(event) => { setVariantKey(event.target.value); setQuantity(1); }}
            className="h-9 w-full rounded-lg border border-[#e4e4e4] bg-white px-2 text-[11px] font-semibold outline-none transition focus:border-[#ff464b] sm:text-xs"
          >
            {availableVariants.map((variant) => <option key={variant._key} value={variant._key} disabled={variant.stock < 1}>{variant.title}{variant.stock < 1 ? " — Out of stock" : ""}</option>)}
          </select>
        </label>}
        <div className="mt-2 flex gap-1.5 sm:gap-2">
          <div className="flex h-10 shrink-0 items-center rounded-lg border border-[#e4e4e4] bg-white">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || soldOut} className="flex h-full w-7 items-center justify-center rounded-l-lg text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-35 sm:w-8" aria-label={`Decrease ${product.title} quantity`}><Minus size={13} /></button>
            <span className="w-5 text-center text-xs font-bold tabular-nums sm:w-6">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(stock, value + 1))} disabled={quantity >= stock || soldOut} className="flex h-full w-7 items-center justify-center rounded-r-lg text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-35 sm:w-8" aria-label={`Increase ${product.title} quantity`}><Plus size={13} /></button>
          </div>
          <button type="button" onClick={addToCart} disabled={soldOut} className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-[#ff464b] px-2 text-[10px] font-bold text-white transition hover:bg-[#e8343a] disabled:cursor-not-allowed disabled:bg-stone-300 sm:gap-1.5 sm:px-3 sm:text-xs" aria-label={`Add ${quantity} ${product.title} to cart`}>
            <ShoppingBag size={14} className="shrink-0" />
            <span className="sm:hidden">{soldOut ? "Sold out" : "Add"}</span>
            <span className="hidden sm:inline">{soldOut ? "Out of stock" : "Add to cart"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
