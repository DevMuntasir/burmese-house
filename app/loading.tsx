export default function Loading() {
  return (
    <div className="container-shell py-12">
      <div className="h-8 w-52 animate-pulse rounded bg-stone-200" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded bg-stone-100" />)}
      </div>
    </div>
  );
}
