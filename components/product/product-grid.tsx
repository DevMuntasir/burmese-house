import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="card col-span-full py-16 text-center text-stone-500">No products found. Try a different category or search.</div>;
  return <div className="grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>;
}
