import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product/product-grid";
import { HomeHero } from "@/components/storefront/home-hero";
import { getBanners, getCategories, getProducts } from "@/lib/sanity/data";

export default async function HomePage() {
  const [products, categories, banners] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
  ]);
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const bestSelling = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNewArrival).slice(0, 4);
  return (
    <>
      <HomeHero banners={banners} />
      <section className="container-shell py-8 sm:py-[68px]">
        <div className="section-heading"><div><p className="eyebrow hidden sm:block">Find your flavour</p><h2 className="text-[20px] font-semibold sm:display-title sm:mt-2 sm:text-4xl"><span className="sm:hidden">ফ্লেভার</span><span className="hidden sm:inline">Choose your favourite taste</span></h2></div><Link href="/products" className="flex items-center gap-1 text-[11px] font-medium text-[#ff464b] sm:text-sm sm:font-bold">সব দেখুন <ArrowRight size={13} className="sm:hidden" /><ArrowRight size={16} className="hidden sm:block" /></Link></div>
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-3 sm:gap-8">{categories.slice(0, 4).map((category) => <Link key={category._id} href={`/category/${category.slug}`} className="group text-center"><div className="relative mx-auto aspect-square overflow-hidden rounded-full bg-stone-100"><Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 23vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" /></div><h3 className="mt-3 text-[10px] font-bold leading-tight sm:text-sm">{category.name}</h3></Link>)}</div>
      </section>
      <section className="bg-[#f8f8f8] py-8 sm:py-[68px]"><div className="container-shell"><div className="section-heading"><div><p className="eyebrow hidden sm:block">Small-batch favourites</p><h2 className="text-[20px] font-semibold sm:display-title sm:mt-2 sm:text-4xl"><span className="sm:hidden">বিশেষ অফার</span><span className="hidden sm:inline">Popular Burmese achar</span></h2></div><Link href="/products" className="flex items-center gap-1 text-[11px] font-medium text-[#ff464b] sm:text-sm sm:font-bold">সব দেখুন <ArrowRight size={15} /></Link></div><div className="mb-5 flex gap-2 overflow-x-auto sm:hidden"><span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs">সব</span><span className="rounded-full bg-[#ff464b] px-4 py-2 text-xs text-white">অফার</span><span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs">জনপ্রিয়</span><span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs">Combo</span></div><ProductGrid products={featured.length ? featured : products.slice(0, 8)} /></div></section>
      {/* <section className="section-space container-shell">
        <div className="grid overflow-hidden bg-[#173f25] text-white lg:grid-cols-2"><div className="relative min-h-[330px]"><Image src="/images/chili-chutney.png" fill sizes="50vw" className="object-cover" alt="Burmese chili garlic chutney" /></div><div className="flex flex-col items-start justify-center px-8 py-12 sm:px-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-green-200">For the spice lovers</p><h2 className="display-title mt-4 text-4xl sm:text-5xl">ঝাল, রসুন আর বার্মিজ মসলার জমজমাট স্বাদ।</h2><p className="mt-5 max-w-lg text-sm leading-6 text-green-100/80">ভাত, খিচুড়ি, পরোটা কিংবা স্ন্যাকস—এক চামচ Chili Garlic Chutney-তেই খাবার হয়ে উঠবে আরও মজাদার।</p><Link href="/category/chili-chutney" className="button-outline mt-7 border-white bg-transparent text-white hover:bg-white">ঝাল আচার দেখুন <ArrowRight size={16} /></Link></div></div>
      </section> */}
      <section className="section-space border-y border-stone-200"><div className="container-shell"><div className="section-heading"><div><p className="eyebrow">Customer favourites</p><h2 className="display-title mt-2 text-3xl sm:text-4xl">সবচেয়ে জনপ্রিয়</h2></div></div><ProductGrid products={bestSelling.length ? bestSelling : products.slice(0, 4)} /></div></section>
      <section className="section-space container-shell"><div className="section-heading"><div><p className="eyebrow">Freshly added</p><h2 className="display-title mt-2 text-3xl sm:text-4xl">নতুন প্যাক ও কম্বো</h2></div><Link href="/products?sort=new" className="flex items-center gap-1 text-sm font-bold text-[#ff464b]">সব দেখুন <ArrowRight size={16} /></Link></div><ProductGrid products={newArrivals.length ? newArrivals : products.slice(-4)} /></section>
      <section className="container-shell mb-8"><div className="subtle-grid flex flex-col items-center bg-[#f0e7df] px-6 py-12 text-center"><p className="eyebrow">Burmese House updates</p><h2 className="display-title mt-2 text-3xl">নতুন স্বাদ ও অফারের খবর পান সবার আগে।</h2><p className="mt-3 text-sm text-stone-600">নতুন batch, combo offer এবং আচার সংরক্ষণের টিপস সরাসরি আপনার inbox-এ।</p><form className="mt-6 flex w-full max-w-md"><input type="email" className="field rounded-r-none" placeholder="আপনার email address" aria-label="Email address" /><button className="button-primary rounded-l-none">Subscribe</button></form></div></section>
    </>
  );
}
