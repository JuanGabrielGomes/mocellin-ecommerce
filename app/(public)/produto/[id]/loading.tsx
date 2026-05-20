export default function ProdutoLoading() {
  return (
    <main className="pt-20 sm:pt-24">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-mj-border bg-mj-surface px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-mj-border">/</span>}
              <div className="h-2.5 w-14 animate-pulse rounded bg-mj-border" />
            </div>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Galeria skeleton */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square w-full animate-pulse bg-mj-border" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square w-16 animate-pulse bg-mj-border" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="flex w-full flex-col gap-5 lg:w-1/2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-mj-border" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-mj-border" />
            <div className="h-7 w-28 animate-pulse rounded bg-mj-border" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-full animate-pulse rounded bg-mj-border" />
              <div className="h-3 w-full animate-pulse rounded bg-mj-border" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-mj-border" />
            </div>
            <div className="mt-4 h-12 w-full animate-pulse rounded bg-mj-border" />
            <div className="h-12 w-full animate-pulse rounded bg-mj-border" />
          </div>
        </div>
      </div>
    </main>
  )
}
