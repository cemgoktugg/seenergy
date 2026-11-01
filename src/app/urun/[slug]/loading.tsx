/**
 * What a product shows while its data is on the way (a page not prerendered
 * yet, or a slow connection): the same frame as the page, so nothing jumps when
 * it arrives. No figures: a price is never guessed at.
 */
export default function ProductLoading() {
  const bar = 'animate-pulse rounded-(--card-radius) bg-line motion-reduce:animate-none';
  return (
    <div role="status" aria-label="Ürün yükleniyor" className="bg-surface-card pb-10">
      <div className="container-main pb-5 pt-3">
        <div className={`h-4 w-64 max-w-full ${bar}`} />
        <div className="mt-3 grid gap-5 lg:grid-cols-[55fr_45fr] dt:gap-8">
          <div className="aspect-[4/3] rounded-(--card-radius) bg-showcase sm:aspect-[16/9] lg:aspect-[5/4]" />
          <div>
            <div className={`h-5 w-28 ${bar}`} />
            <div className={`mt-3 h-10 w-2/3 ${bar}`} />
            <div className={`mt-2 h-6 w-1/2 ${bar}`} />
            <div className={`mt-4 h-24 ${bar}`} />
            <div className={`mt-4 h-10 w-1/2 ${bar}`} />
            <div className={`mt-4 h-13 ${bar}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
