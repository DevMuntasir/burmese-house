"use client";

import { Check, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-provider";
import { cn, discountPercent, formatPrice, productPrice } from "@/lib/format";
import type { CartItem, Product } from "@/lib/types";

export function ProductDetail({ product }: { product: Product }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [variantKey, setVariantKey] = useState(product.variants?.find((variant) => variant.active && variant.stock > 0)?._key ?? "");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const selectedVariant = product.variants?.find((variant) => variant._key === variantKey);
  const stock = selectedVariant?.stock ?? product.stockQuantity;
  const price = productPrice(product.regularPrice, product.salePrice) + (selectedVariant?.priceAdjustment ?? 0);
  const discount = discountPercent(product.regularPrice, product.salePrice);
  const images = useMemo(() => [selectedVariant?.image, ...product.images].filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index), [product.images, selectedVariant?.image]);
  const cartItem: CartItem = { id: `${product._id}:${variantKey || "default"}`, productId: product._id, slug: product.slug, title: product.title, image: images[imageIndex] ?? images[0], price, quantity, variantKey: selectedVariant?._key, variantTitle: selectedVariant?.title, sku: selectedVariant?.sku ?? product.sku, maxStock: stock };
  const validate = () => {
    if (product.variants?.length && !selectedVariant) { toast.error("Please select an option"); return false; }
    if (stock < 1) { toast.error("Out of stock"); return false; }
    return true;
  };
  const add = () => { if (validate()) addItem(cartItem); };
  const buy = () => { if (!validate()) return; sessionStorage.setItem("burmese-house-buy-now", JSON.stringify([cartItem])); router.push("/checkout?buyNow=1"); };
  return <div className="container-shell py-8 sm:py-12"><div className="grid gap-9 lg:grid-cols-[1.06fr_.94fr] lg:gap-14">
    <div className="grid gap-3 sm:grid-cols-[82px_1fr]"><div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">{images.map((image, index) => <button key={image} onClick={() => setImageIndex(index)} className={cn("relative aspect-square w-20 shrink-0 overflow-hidden border bg-stone-100", index === imageIndex ? "border-[#6f2742]" : "border-stone-200")}><Image src={image} alt="" fill sizes="80px" className="object-cover" /></button>)}</div><div className="relative order-1 aspect-[4/5] overflow-hidden bg-[#f4f1ef] sm:order-2"><Image src={images[imageIndex] ?? images[0]} alt={product.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div></div>
    <div><p className="eyebrow">{product.category.name}</p><h1 className="display-title mt-3 text-4xl leading-tight sm:text-5xl">{product.title}</h1><div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-2xl font-extrabold text-[#6f2742]">{formatPrice(price)}</span>{product.salePrice && <span className="text-base text-stone-400 line-through">{formatPrice(product.regularPrice)}</span>}{discount > 0 && <span className="bg-[#f2e5e9] px-2 py-1 text-xs font-bold text-[#6f2742]">Save {discount}%</span>}</div><div className="mt-3 flex items-center gap-4 text-xs text-stone-500"><span>SKU: {selectedVariant?.sku ?? product.sku}</span>{product.soldCount ? <span>{product.soldCount}+ sold</span> : null}</div><p className="mt-6 border-t border-stone-200 pt-6 text-sm leading-7 text-stone-600">{product.shortDescription}</p>
      {product.variants?.length ? <div className="mt-7"><div className="flex items-center justify-between"><span className="label mb-0">Choose option</span><span className={`text-xs font-semibold ${stock > 0 ? "text-emerald-700" : "text-red-600"}`}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span></div><div className="mt-3 flex flex-wrap gap-2">{product.variants.filter((variant) => variant.active).map((variant) => <button key={variant._key} disabled={variant.stock < 1} onClick={() => { setVariantKey(variant._key); setImageIndex(0); }} className={cn("relative min-w-20 border px-4 py-2.5 text-sm font-semibold", variantKey === variant._key ? "border-[#6f2742] bg-[#f7eef1] text-[#6f2742]" : "border-stone-300", variant.stock < 1 && "cursor-not-allowed opacity-40 line-through")}>{variant.title}{variantKey === variant._key && <Check size={12} className="absolute right-1 top-1" />}</button>)}</div></div> : <p className={`mt-6 text-xs font-semibold ${stock > 0 ? "text-emerald-700" : "text-red-600"}`}>{stock > 0 ? <><Check size={14} className="mr-1 inline" />In stock and ready to ship</> : "Out of stock"}</p>}
      <div className="mt-7 flex gap-3"><div className="flex h-12 items-center border border-stone-300"><button aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-full w-11 items-center justify-center"><Minus size={16} /></button><span className="w-8 text-center text-sm font-bold">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(stock, value + 1))} className="flex h-full w-11 items-center justify-center"><Plus size={16} /></button></div><button onClick={add} disabled={stock < 1} className="button-outline h-12 flex-1 disabled:opacity-40"><ShoppingBag size={18} /> Add to cart</button></div><button onClick={buy} disabled={stock < 1} className="button-primary mt-3 h-12 w-full disabled:opacity-40">Buy it now</button>
      <div className="mt-7 space-y-3 border-y border-stone-200 py-5 text-sm"><p className="flex items-center gap-3"><Truck size={18} className="text-[#6f2742]" /><span><strong>Delivery:</strong> 1–2 days inside Dhaka, 3–5 days nationwide</span></p><p className="flex items-center gap-3"><Check size={18} className="text-[#6f2742]" /><span><strong>Easy returns:</strong> Check before accepting delivery</span></p></div>
    </div>
  </div></div>;
}
