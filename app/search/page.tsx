import { Search } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeading } from "@/components/shared/page-heading";
import { getProducts } from "@/lib/sanity/data";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await getProducts();
  const needle = q.trim().toLowerCase();
  const results = needle ? products.filter((item) => [item.title, item.sku, item.category?.name, item.shortDescription].join(" ").toLowerCase().includes(needle)) : [];
  return <><PageHeading title="Search" subtitle={needle ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”` : "Find something beautiful for your everyday."} /><div className="container-shell py-9"><form className="relative mx-auto mb-10 max-w-2xl"><input name="q" defaultValue={q} className="field h-14 pr-14 text-base" placeholder="Search by product, category or SKU" autoFocus /><button aria-label="Search" className="absolute right-0 top-0 flex h-14 w-14 items-center justify-center bg-[#6f2742] text-white"><Search size={20} /></button></form>{needle ? <ProductGrid products={results} /> : <div className="py-14 text-center text-stone-500">Start typing to discover products.</div>}</div></>;
}
