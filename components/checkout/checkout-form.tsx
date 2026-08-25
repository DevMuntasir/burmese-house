"use client";

import { CheckCircle2, LoaderCircle, LockKeyhole, MapPin, Smartphone } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import type { CartItem, StoreSettings } from "@/lib/types";

type CheckoutFields = {
  customerName: string; phone: string; email: string; district: string; area: string; address: string; note: string;
  deliveryZone: "inside-dhaka" | "outside-dhaka"; paymentMethod: "cod" | "bkash"; senderBkashNumber: string; transactionId: string;
};

export function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const cart = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [buyNowItems, setBuyNowItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [serverError, setServerError] = useState("");
  const isBuyNow = searchParams.get("buyNow") === "1";
  useEffect(() => {
    if (isBuyNow) {
      try { setBuyNowItems(JSON.parse(sessionStorage.getItem("burmese-house-buy-now") || "[]") as CartItem[]); } catch { setBuyNowItems([]); }
    }
    setReady(true);
  }, [isBuyNow]);
  const items = isBuyNow ? buyNowItems : cart.items;
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFields>({ defaultValues: { deliveryZone: "inside-dhaka", paymentMethod: "cod", email: "", note: "", senderBkashNumber: "", transactionId: "" } });
  const zone = watch("deliveryZone");
  const method = watch("paymentMethod");
  const shipping = zone === "inside-dhaka" ? settings.insideDhakaCharge : settings.outsideDhakaCharge;
  const total = subtotal + shipping;
  const onSubmit = async (fields: CheckoutFields) => {
    setServerError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, items: items.map((item) => ({ productId: item.productId, variantKey: item.variantKey, quantity: item.quantity })) }) });
      const result = await response.json() as { error?: string; orderId?: string; orderNumber?: string; total?: number; status?: string; paymentStatus?: string };
      if (!response.ok || !result.orderNumber) throw new Error(result.error || "Order could not be placed");
      const savedOrder = { ...result, ...fields, items, subtotal, shippingCharge: shipping, total, orderStatus: "placed", createdAt: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem("burmese-house-orders-v1") || "[]") as unknown[];
      localStorage.setItem("burmese-house-orders-v1", JSON.stringify([savedOrder, ...existing]));
      if (!isBuyNow) cart.clearCart(); else sessionStorage.removeItem("burmese-house-buy-now");
      toast.success("Order placed successfully");
      router.push(`/order-success/${result.orderNumber}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Order could not be placed";
      setServerError(message); toast.error(message);
    }
  };
  if (!ready) return <div className="flex min-h-80 items-center justify-center"><LoaderCircle className="animate-spin" /></div>;
  if (!items.length) return <div className="container-shell py-20 text-center"><h1 className="display-title text-4xl">Nothing to checkout</h1><p className="mt-3 text-stone-500">Your shopping bag is empty.</p><button className="button-primary mt-7" onClick={() => router.push("/products")}>Browse products</button></div>;
  return <form onSubmit={handleSubmit(onSubmit)} className="container-shell grid gap-8 py-8 lg:grid-cols-[1fr_420px] lg:py-12">
    <div className="space-y-8">
      <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6f2742] text-sm font-bold text-white">1</span><h2 className="display-title text-2xl">Delivery information</h2></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" error={errors.customerName?.message}><input className="field" {...register("customerName", { required: "Full name is required", minLength: { value: 2, message: "Enter your full name" } })} placeholder="Your full name" /></Field><Field label="Mobile number" error={errors.phone?.message}><input inputMode="tel" className="field" {...register("phone", { required: "Mobile number is required", pattern: { value: /^01[3-9]\d{8}$/, message: "Use 01XXXXXXXXX format" } })} placeholder="01XXXXXXXXX" /></Field><Field label="Email (optional)" error={errors.email?.message}><input type="email" className="field" {...register("email")} placeholder="you@example.com" /></Field><Field label="District" error={errors.district?.message}><input className="field" {...register("district", { required: "District is required" })} placeholder="e.g. Dhaka" /></Field><Field label="Area / Thana" error={errors.area?.message}><input className="field" {...register("area", { required: "Area is required" })} placeholder="e.g. Mirpur" /></Field><div className="sm:col-span-2"><Field label="Full address" error={errors.address?.message}><textarea rows={3} className="field" {...register("address", { required: "Address is required", minLength: { value: 8, message: "Add a complete address" } })} placeholder="House, road, landmark and area" /></Field></div><div className="sm:col-span-2"><Field label="Order note (optional)"><textarea rows={2} className="field" {...register("note")} placeholder="Any delivery note?" /></Field></div></div></section>
      <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6f2742] text-sm font-bold text-white">2</span><h2 className="display-title text-2xl">Delivery area</h2></div><div className="grid gap-3 sm:grid-cols-2"><RadioCard value="inside-dhaka" current={zone} register={register("deliveryZone")} title="Inside Dhaka" detail={`Delivery charge ${formatPrice(settings.insideDhakaCharge)}`} icon={<MapPin size={19} />} /><RadioCard value="outside-dhaka" current={zone} register={register("deliveryZone")} title="Outside Dhaka" detail={`Delivery charge ${formatPrice(settings.outsideDhakaCharge)}`} icon={<MapPin size={19} />} /></div></section>
      <section><div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6f2742] text-sm font-bold text-white">3</span><h2 className="display-title text-2xl">Payment</h2></div><div className="space-y-3">{settings.cashOnDeliveryEnabled && <RadioCard value="cod" current={method} register={register("paymentMethod")} title="Cash on Delivery" detail="Pay when your order arrives" icon={<CheckCircle2 size={19} />} />}{settings.bkashEnabled && <RadioCard value="bkash" current={method} register={register("paymentMethod")} title="Manual bKash" detail="Send money and submit your Transaction ID" icon={<Smartphone size={19} />} />}</div>{method === "bkash" && <div className="mt-4 border border-[#dec9d1] bg-[#fbf5f7] p-5"><p className="text-xs font-bold uppercase tracking-wider text-[#6f2742]">Send money to</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><div><p className="text-lg font-extrabold">{settings.bkashNumber}</p><p className="text-xs text-stone-500">bKash {settings.bkashAccountType}</p></div><strong className="text-xl text-[#6f2742]">{formatPrice(total)}</strong></div><p className="mt-3 text-xs leading-5 text-stone-600">{settings.bkashInstructions}</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Sender bKash number" error={errors.senderBkashNumber?.message}><input className="field" inputMode="tel" {...register("senderBkashNumber", { required: "Sender number is required", pattern: { value: /^01[3-9]\d{8}$/, message: "Use 01XXXXXXXXX format" } })} /></Field><Field label="Transaction ID" error={errors.transactionId?.message}><input className="field uppercase" {...register("transactionId", { required: "Transaction ID is required", minLength: { value: 5, message: "Enter a valid Transaction ID" } })} /></Field></div></div>}</section>
    </div>
    <aside className="h-fit bg-[#f7f4f3] p-5 sm:p-7 lg:sticky lg:top-28"><h2 className="display-title text-2xl">Your order</h2><div className="mt-5 max-h-80 space-y-4 overflow-y-auto border-y border-stone-200 py-5">{items.map((item) => <div key={item.id} className="grid grid-cols-[60px_1fr_auto] gap-3"><div className="relative aspect-[4/5] overflow-hidden bg-white"><Image src={item.image} alt={item.title} fill sizes="60px" className="object-cover" /><span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-[#211b1d] text-[10px] text-white">{item.quantity}</span></div><div><p className="line-clamp-2 text-xs font-bold leading-4">{item.title}</p>{item.variantTitle && <p className="mt-1 text-[10px] text-stone-500">{item.variantTitle}</p>}</div><strong className="text-xs">{formatPrice(item.price * item.quantity)}</strong></div>)}</div><div className="space-y-3 py-5 text-sm"><div className="flex justify-between"><span className="text-stone-600">Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="flex justify-between"><span className="text-stone-600">Delivery</span><strong>{formatPrice(shipping)}</strong></div></div><div className="flex justify-between border-t border-stone-300 pt-5 text-xl"><strong>Total</strong><strong className="text-[#6f2742]">{formatPrice(total)}</strong></div>{serverError && <p role="alert" className="mt-4 bg-red-50 p-3 text-xs text-red-700">{serverError}</p>}<button disabled={isSubmitting} className="button-primary mt-6 w-full disabled:opacity-60">{isSubmitting ? <><LoaderCircle size={17} className="animate-spin" /> Placing order...</> : <>Place order · {formatPrice(total)}</>}</button><p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-500"><LockKeyhole size={13} /> Your information is protected</p></aside>
  </form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="label">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>; }
function RadioCard({ value, current, register, title, detail, icon }: { value: string; current: string; register: ReturnType<ReturnType<typeof useForm<CheckoutFields>>["register"]>; title: string; detail: string; icon: React.ReactNode }) { return <label className={`flex cursor-pointer items-center gap-3 border p-4 ${current === value ? "border-[#6f2742] bg-[#fbf5f7]" : "border-stone-200 bg-white"}`}><input type="radio" value={value} {...register} className="accent-[#6f2742]" /><span className="text-[#6f2742]">{icon}</span><span><strong className="block text-sm">{title}</strong><span className="text-xs text-stone-500">{detail}</span></span></label>; }
