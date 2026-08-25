import type { Metadata } from "next";
import { OrderSuccess } from "@/components/order/order-success";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: false } };
export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) { return <OrderSuccess orderNumber={(await params).orderId} />; }
