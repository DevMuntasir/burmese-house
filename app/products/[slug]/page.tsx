import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { getProduct, getProducts } from "@/lib/sanity/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.shortDescription, openGraph: { images: (product.images ?? []).slice(0, 1) } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const products = await getProducts();
  const related = product.category?.slug ? products.filter((item) => item._id !== product._id && item.category?.slug === product.category?.slug).slice(0, 4) : [];
  return <><div className="container-shell pt-6 text-xs text-stone-500"><Link href="/">Home</Link> <span className="mx-2">/</span> {product.category?.slug ? <Link href={`/category/${product.category.slug}`}>{product.category.name}</Link> : <span>Uncategorized</span>} <span className="mx-2">/</span> <span>{product.title}</span></div><ProductDetail product={product} /><section className="border-y border-stone-200 bg-[#f7f4f3]"><div className="container-shell py-12"><div className="grid gap-10 lg:grid-cols-[1fr_.8fr]"><div><p className="eyebrow">Product details</p><h2 className="display-title mt-2 text-3xl">Description</h2><p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-stone-600">{product.description}</p></div><div>{product.specifications?.length ? <div className="card divide-y divide-stone-200">{product.specifications.map((item) => <div key={item.label} className="grid grid-cols-2 px-5 py-3 text-sm"><span className="font-bold">{item.label}</span><span className="text-stone-600">{item.value}</span></div>)}</div> : null}</div></div></div></section>{related.length > 0 && <section className="section-space container-shell"><div className="section-heading"><div><p className="eyebrow">You may also like</p><h2 className="display-title mt-2 text-3xl sm:text-4xl">Related products</h2></div></div><ProductGrid products={related} /></section>}</>;
}
