import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { PageHeading } from "@/components/shared/page-heading";
import { getCategories, getProducts } from "@/lib/sanity/data";

export const metadata: Metadata = { title: "All Chutneys", description: "Shop handmade Burmese mango, tamarind and chili garlic chutney from Burmese House." };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ sort?: string; category?: string }> }) {
  const [{ sort, category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  let visible = category ? products.filter((item) => item.category?.slug === category) : [...products];
  if (sort === "price-low") visible.sort((a, b) => (a.salePrice ?? a.regularPrice) - (b.salePrice ?? b.regularPrice));
  if (sort === "price-high") visible.sort((a, b) => (b.salePrice ?? b.regularPrice) - (a.salePrice ?? a.regularPrice));
  if (sort === "sale") visible = visible.filter((item) => item.salePrice);
  if (sort === "new") visible = visible.filter((item) => item.isNewArrival);
  return <><PageHeading title="সব আচার ও চাটনি" subtitle="Burmese House-এর ঘরে তৈরি আম, তেঁতুল, চিলি গার্লিক আচার এবং সাশ্রয়ী combo pack থেকে পছন্দ করুন।" /><div className="container-shell py-9"><div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-5 md:flex-row md:items-center md:justify-between"><div className="flex gap-2 overflow-x-auto pb-1"> <Link href="/products" className={`shrink-0 border px-3 py-2 text-xs font-bold ${!category ? "border-[#ff464b] bg-[#ff464b] text-white" : "border-stone-200"}`}>সব</Link>{categories.map((item) => <Link key={item._id} href={`/products?category=${item.slug}`} className={`shrink-0 border px-3 py-2 text-xs font-bold ${category === item.slug ? "border-[#ff464b] bg-[#ff464b] text-white" : "border-stone-200"}`}>{item.name}</Link>)}</div><form className="flex items-center gap-3"><span className="whitespace-nowrap text-xs text-stone-500">{visible.length} products</span><select name="sort" defaultValue={sort ?? "featured"} className="field h-10 min-h-10 w-44 text-sm" onChange={undefined}><option value="featured">Featured</option><option value="new">Newest</option><option value="sale">On sale</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><button className="button-outline min-h-10 px-3">Apply</button>{category && <input type="hidden" name="category" value={category} />}</form></div><ProductGrid products={visible} /></div></>;
}
