import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="eyebrow">404 error</span>
      <h1 className="display-title mt-3 text-5xl">This page wandered off.</h1>
      <p className="mt-4 max-w-md text-stone-500">The page or product you are looking for is no longer available.</p>
      <Link href="/products" className="button-primary mt-7">Continue shopping</Link>
    </div>
  );
}
