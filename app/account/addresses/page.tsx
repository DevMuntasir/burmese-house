import type { Metadata } from "next";
import { AccountAddresses } from "@/components/account/account-addresses";

export const metadata: Metadata = {
  title: "Delivery Addresses",
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return <AccountAddresses />;
}
