"use client";

import { LoaderCircle, MessageCircle, PackageSearch, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { OrderTimeline } from "./order-timeline";
import { formatPhoneForTel, formatWhatsAppLink } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import type { CartItem, OrderStatus, StoreSettings } from "@/lib/types";

type TrackedOrder = {
  orderNumber: string;
  customerName: string;
  phone: string;
  items: Array<CartItem | { title: string; quantity: number; lineTotal: number; unitPrice: number; variantTitle?: string }>;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  createdAt: string;
};

export function TrackOrderForm({ settings }: { settings?: StoreSettings }) {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    if (!/^01[3-9]\d{8}$/.test(phone)) return setError("Enter a valid mobile number in 01XXXXXXXXX format");
    setLoading(true);
    try {
      const local = (JSON.parse(localStorage.getItem("burmese-house-orders-v1") || "[]") as TrackedOrder[]).find(
        (item) => item.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() && item.phone === phone
      );
      if (local) {
        setOrder(local);
        return;
      }
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber.trim())}&phone=${encodeURIComponent(phone)}`);
      const result = (await response.json()) as TrackedOrder & { error?: string };
      if (!response.ok) throw new Error(result.error || "Order not found");
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = settings?.whatsapp
    ? formatWhatsAppLink(
        settings.whatsapp,
        orderNumber
          ? `Hi ${settings.storeName || "Burmese House"}, I need help tracking order #${orderNumber}.`
          : `Hi ${settings.storeName || "Burmese House"}, I need help tracking my order.`
      )
    : "";

  return (
    <div className="container-shell max-w-3xl py-10">
      <form onSubmit={submit} className="card mx-auto max-w-xl p-5 sm:p-8">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3e8ec] text-[#6f2742]">
          <PackageSearch />
        </div>
        <h2 className="display-title text-2xl">Find your order</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Use the order number from your confirmation and the same phone number used at checkout.
        </p>
        <label className="mt-6 block">
          <span className="label">Order number</span>
          <input
            className="field uppercase"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="BH-260825-ABCDE"
            required
          />
        </label>
        <label className="mt-4 block">
          <span className="label">Mobile number</span>
          <input
            className="field"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            required
          />
        </label>
        {error && <p className="mt-4 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="button-primary mt-5 w-full disabled:opacity-60">
          {loading ? <LoaderCircle size={17} className="animate-spin" /> : null} Track order
        </button>
      </form>

      {order && (
        <div className="card mt-8 p-5 sm:p-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="eyebrow">Order found</p>
              <h3 className="display-title mt-1 text-2xl">{order.orderNumber}</h3>
              <p className="mt-1 text-xs text-stone-500">
                Placed {new Date(order.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-[#f3e8ec] px-3 py-1 text-xs font-bold capitalize text-[#6f2742]">
                {order.orderStatus}
              </span>
              <p className="mt-2 text-xs text-stone-500">
                Payment: <strong className="capitalize">{order.paymentStatus}</strong>
              </p>
            </div>
          </div>
          <div className="mt-8">
            <OrderTimeline status={order.orderStatus} />
          </div>
          <div className="mt-8 divide-y divide-stone-200 border-t border-stone-200">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-3 text-sm">
                <span>
                  {"title" in item ? item.title : "Product"} × {item.quantity}
                </span>
                <strong>{formatPrice("lineTotal" in item ? item.lineTotal : item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-stone-300 pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      {/* Support Helpline Box */}
      {settings && (
        <div className="mt-8 mx-auto max-w-xl text-center">
          <p className="text-xs text-stone-500">
            Having trouble locating your order or have questions about delivery?
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {settings.phone && (
              <a
                href={formatPhoneForTel(settings.phone)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6f2742] hover:underline"
              >
                <Phone size={13} /> Call Helpline: {settings.phone}
              </a>
            )}
            {settings.whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle size={13} /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
