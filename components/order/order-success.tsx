"use client";

import { Check, Copy, Mail, MapPin, MessageCircle, PackageCheck, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderTimeline } from "./order-timeline";
import { formatEmailLink, formatPhoneForTel, formatWhatsAppLink } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import type { CartItem, StoreSettings } from "@/lib/types";

type StoredOrder = {
  orderNumber: string;
  customerName: string;
  phone: string;
  district: string;
  area: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: "placed";
  createdAt: string;
};

export function OrderSuccess({ orderNumber, settings }: { orderNumber: string; settings?: StoreSettings }) {
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const orders = JSON.parse(localStorage.getItem("burmese-house-orders-v1") || "[]") as StoredOrder[];
      setOrder(orders.find((item) => item.orderNumber === orderNumber) ?? null);
    }, 0);
    return () => clearTimeout(timer);
  }, [orderNumber]);

  const copy = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  };

  const whatsappUrl = settings?.whatsapp
    ? formatWhatsAppLink(
        settings.whatsapp,
        `Hi ${settings.storeName || "Burmese House"}, I just placed order #${orderNumber} and need assistance.`
      )
    : "";

  return (
    <div className="container-shell max-w-4xl py-10 sm:py-16">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <PackageCheck size={32} />
        </div>
        <p className="eyebrow mt-6">Thank you for your order</p>
        <h1 className="display-title mt-2 text-4xl sm:text-5xl">Your order is confirmed.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-stone-600">
          We’ve received your order and will call you if any confirmation is needed.
        </p>
        <button
          onClick={copy}
          className="mt-5 inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2 text-sm transition hover:bg-stone-50"
        >
          <span>
            Order <strong>{orderNumber}</strong>
          </span>
          <Copy size={14} />
        </button>
      </div>

      <div className="card mt-10 p-5 sm:p-8">
        <h2 className="display-title text-2xl">Order progress</h2>
        <div className="mt-7">
          <OrderTimeline status={order?.orderStatus ?? "placed"} />
        </div>
      </div>

      {order && (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-bold">Delivery details</h3>
            <p className="mt-4 flex gap-3 text-sm leading-6 text-stone-600">
              <MapPin size={18} className="mt-1 shrink-0 text-[#6f2742]" />
              <span>
                {order.customerName}
                <br />
                {order.address}, {order.area}, {order.district}
                <br />
                {order.phone}
              </span>
            </p>
          </div>
          <div className="card p-5">
            <h3 className="font-bold">Payment summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Delivery</span>
                <span>{formatPrice(order.shippingCharge)}</span>
              </p>
              <p className="flex justify-between border-t border-stone-200 pt-2 font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                <Check size={14} />
                {order.paymentMethod === "bkash" ? "bKash payment submitted for verification" : "Cash on Delivery"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Post-Order Support & Contact Card */}
      {settings && (
        <div className="card mt-6 bg-[#fbf9f8] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Need help with your order?</h3>
              <p className="mt-1 text-xs text-stone-500">
                আমাদের কাস্টমার কেয়ার প্রতিনিধির সাথে যোগাযোগ করতে পারেন যেকোনো সময়।
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {settings.phone && (
                <a
                  href={formatPhoneForTel(settings.phone)}
                  className="button-outline flex items-center gap-1.5 text-xs bg-white"
                >
                  <Phone size={13} /> {settings.phone}
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-[#25d366] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#20bd5a]"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="button-primary">
          Continue shopping
        </Link>
        <Link href="/track-order" className="button-outline">
          Track order
        </Link>
      </div>
    </div>
  );
}
