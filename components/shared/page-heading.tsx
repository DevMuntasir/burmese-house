import Link from "next/link";

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="border-b border-stone-200 bg-[#f7f4f3] py-9 sm:py-12"><div className="container-shell"><div className="mb-3 flex gap-2 text-xs text-stone-500"><Link href="/">Home</Link><span>/</span><span>{title}</span></div><h1 className="display-title text-4xl sm:text-5xl">{title}</h1>{subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">{subtitle}</p>}</div></div>;
}
