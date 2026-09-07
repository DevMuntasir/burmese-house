import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getAdminOrders, getCategories, getProducts } from "@/lib/sanity/data";

export const metadata: Metadata = {
  title: "Merchant Dashboard — Burmese House",
  description: "Manage products, track online & in-shop orders, and update fulfillment status.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("burmese_admin_auth");
  const initialAuthenticated = authCookie?.value === "authenticated";

  const [products, categories, orders] = await Promise.all([
    getProducts(),
    getCategories(),
    getAdminOrders(),
  ]);

  return (
    <DashboardView
      initialProducts={products}
      categories={categories}
      initialOrders={orders}
      initialAuthenticated={initialAuthenticated}
    />
  );
}

