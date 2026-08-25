import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/order/track-order-form";
import { PageHeading } from "@/components/shared/page-heading";
export const metadata: Metadata = { title: "Track Order", robots: { index: false, follow: false } };
export default function TrackOrderPage() { return <><PageHeading title="Track your order" subtitle="Order number ও checkout-এ ব্যবহৃত mobile number দিয়ে Burmese House order-এর অবস্থা দেখুন।" /><TrackOrderForm /></>; }
