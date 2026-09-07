import type { Metadata } from "next";
import { AccountProfile } from "@/components/account/account-profile";

export const metadata: Metadata = {
  title: "Profile Details",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <AccountProfile />;
}
