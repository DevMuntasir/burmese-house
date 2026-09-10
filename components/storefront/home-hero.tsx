import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeHero() {
  return (
    <>
      <section className="bg-white px-3 pb-3 pt-5 sm:hidden">
        {/* <div className="mb-3 flex items-center justify-between"><h2 className="text-[20px] font-semibold">#আপনারজন্যবিশেষ</h2><Link href="/products?sort=sale" className="text-[11px] font-medium text-[#ff464b]">সব দেখুন</Link></div> */}
        <div className="relative h-[172px] overflow-hidden rounded-[18px] bg-[#281a19] shadow-[0_8px_20px_rgba(0,0,0,.12)]">
          <Image src="/images/hero-chutney.png" alt="Burmese House chutney special offer" fill priority sizes="calc(100vw - 24px)" className="object-cover object-[68%_center]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#211414] via-[#291a18]/90 to-transparent" />
          <div className="relative flex h-full max-w-[62%] flex-col items-start p-4 text-white">
            <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold text-[#222]">সীমিত সময়!</span>
            <h1 className="mt-2 text-[19px] font-bold leading-tight">Burmese Achar Combo</h1>
            <p className="mt-1 text-[13px]">সাশ্রয় করুন <strong className="text-[34px] leading-none">15<sup className="text-[13px]">%</sup></strong></p>
            <Link href="/products?sort=sale" className="mt-auto rounded-full bg-[#ff464b] px-4 py-2 text-[11px] font-bold">অর্ডার করুন</Link>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff464b]" /><span className="h-2 w-2 rounded-full bg-[#dedede]" /><span className="h-2 w-2 rounded-full bg-[#dedede]" /></div>
      </section>
      <section className="relative hidden min-h-[610px] overflow-hidden bg-[#eee4df] sm:block lg:min-h-[620px]">
        <Image src="/images/hero-chutney.png" alt="Burmese House mango, tamarind and chili chutney" fill priority sizes="100vw" className="object-cover object-[65%_center] sm:object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5eee8] via-[#f5eee8]/75 to-transparent sm:via-[#f5eee8]/25" />
        <div className="container-shell relative flex min-h-[520px] items-center py-16 sm:min-h-[610px] lg:min-h-[620px]">
          <div className="max-w-[560px]">
            <span className="eyebrow">Handmade · Small batch · Authentic</span>
            <h1 className="display-title mt-4 text-[44px] leading-[.98] sm:text-6xl lg:text-[74px]">A jar full of Burmese tradition.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-stone-600 sm:text-base">বাছাই করা তাজা উপকরণ ও নিজস্ব মসলায় তৈরি আম, তেঁতুল আর চিলি গার্লিক চাটনি—প্রতিদিনের খাবারকে করে আরও মজাদার।</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/products" className="button-primary">সব আচার দেখুন <ArrowRight size={17} /></Link><Link href="/category/combo-gift-box" className="button-outline">Combo packs</Link></div>
          </div>
        </div>
      </section>
      <section className="hidden border-b border-stone-200 bg-white sm:block"><div className="container-shell grid grid-cols-2 divide-x divide-stone-200 py-4 sm:grid-cols-4">
        {[ [Truck, "সারাদেশে ডেলিভারি", "নিরাপদ প্যাকেজিং"], [ShieldCheck, "ঘরে তৈরি", "বাছাই করা উপকরণ"], [ArrowRight, "সহজ অর্ডার", "দ্রুত checkout"], [ShieldCheck, "নিরাপদ পেমেন্ট", "COD অথবা bKash"] ].map(([Icon, title, copy], index) => {
          const IconComponent = Icon as typeof Truck;
          return <div key={title as string} className={`flex items-center justify-center gap-3 px-2 py-2 ${index > 1 ? "hidden sm:flex" : ""}`}><IconComponent size={20} className="text-[#6f2742]" /><div><p className="text-xs font-bold sm:text-sm">{title as string}</p><p className="text-[10px] text-stone-500 sm:text-xs">{copy as string}</p></div></div>;
        })}
      </div></section>
    </>
  );
}
