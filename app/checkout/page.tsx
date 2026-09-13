import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getStoreSettings } from "@/lib/sanity/data";
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage() { const settings = await getStoreSettings(); return <><div className="border-b border-stone-200 bg-[#f7f4f3] py-7"><div className="container-shell"><h1 className="display-title text-4xl">Checkout</h1><p className="mt-2 text-sm text-stone-500">Complete your order in just a minute.</p></div></div><Suspense><CheckoutForm settings={settings} /></Suspense></>; }
