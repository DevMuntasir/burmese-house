import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/order/track-order-form";
import { PageHeading } from "@/components/shared/page-heading";
import { getStoreSettings } from "@/lib/sanity/data";

export const metadata: Metadata = { title: "Track Order", robots: { index: false, follow: false } };

export default async function TrackOrderPage() {
  const settings = await getStoreSettings();
  return (
    <>
      <PageHeading
        title="Track your order"
        subtitle={`Order number ও checkout-এ ব্যবহৃত mobile number দিয়ে ${settings.storeName} order-এর অবস্থা দেখুন।`}
      />
      <TrackOrderForm settings={settings} />
    </>
  );
}
