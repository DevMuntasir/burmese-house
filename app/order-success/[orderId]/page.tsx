import type { Metadata } from "next";
import { OrderSuccess } from "@/components/order/order-success";
import { getStoreSettings } from "@/lib/sanity/data";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: false } };

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const [resolvedParams, settings] = await Promise.all([params, getStoreSettings()]);
  return <OrderSuccess orderNumber={resolvedParams.orderId} settings={settings} />;
}
