import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeading } from "@/components/shared/page-heading";
import { getCategories, getProducts } from "@/lib/sanity/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return { title: category?.name ?? "Category", description: category?.description ?? `Shop ${category?.name ?? "our collection"} at Burmese House.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const filtered = products.filter((item) => item.category?.slug === slug);
  return <><PageHeading title={category.name} subtitle={category.description ?? `${category.name} collection from Burmese House.`} /><div className="container-shell py-9"><p className="mb-6 text-sm text-stone-500">Showing {filtered.length} products</p><ProductGrid products={filtered} /></div></>;
}
