import type { Category, Product, StoreSettings } from "@/lib/types";
import { categories as fallbackCategories, products as fallbackProducts, storeSettings as fallbackSettings } from "@/lib/mock-data";
import { hasSanityConfig, sanityClient } from "./client";
import { categoriesQuery, productBySlugQuery, productsQuery, settingsQuery } from "./queries";

export async function getProducts(): Promise<Product[]> {
  if (!hasSanityConfig) return fallbackProducts;
  try {
    const data = await sanityClient.fetch<Product[]>(productsQuery, {}, { next: { revalidate: 60, tags: ["products"] } });
    return data.length ? data : fallbackProducts;
  } catch { return fallbackProducts; }
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!hasSanityConfig) return fallbackProducts.find((item) => item.slug === slug) ?? null;
  try {
    return (await sanityClient.fetch<Product | null>(productBySlugQuery, { slug }, { next: { revalidate: 60, tags: [`product:${slug}`] } })) ?? fallbackProducts.find((item) => item.slug === slug) ?? null;
  } catch { return fallbackProducts.find((item) => item.slug === slug) ?? null; }
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSanityConfig) return fallbackCategories;
  try {
    const data = await sanityClient.fetch<Category[]>(categoriesQuery, {}, { next: { revalidate: 120, tags: ["categories"] } });
    return data.length ? data : fallbackCategories;
  } catch { return fallbackCategories; }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!hasSanityConfig) return fallbackSettings;
  try {
    const data = await sanityClient.fetch<Record<string, Record<string, unknown> | null>>(settingsQuery, {}, { next: { revalidate: 120, tags: ["settings"] } });
    const store = data.store ?? {};
    const shipping = data.shipping ?? {};
    const payment = data.payment ?? {};
    return { ...fallbackSettings, ...store, ...shipping, ...payment } as StoreSettings;
  } catch { return fallbackSettings; }
}
