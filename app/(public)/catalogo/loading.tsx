export default function CatalogoLoading() {
  return (
    <main className="pt-20 sm:pt-24">
      {/* Topo */}
      <div className="border-b border-mj-border bg-mj-surface px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-3 w-24 animate-pulse rounded bg-mj-border" />
          <div className="mt-3 h-8 w-48 animate-pulse rounded bg-mj-border" />
        </div>
      </div>

      {/* Filtros skeleton */}
      <div className="border-b border-mj-border bg-mj-surface px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded bg-mj-border" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <ul className="grid grid-cols-2 border-l border-t border-mj-border sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="border-b border-r border-mj-border">
              <div className="flex h-full flex-col bg-mj-surface">
                <div className="aspect-square w-full animate-pulse bg-mj-border" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="h-2.5 w-16 animate-pulse rounded bg-mj-border" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-mj-border" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-mj-border" />
                </div>
                <div className="px-4 pb-4">
                  <div className="h-10 w-full animate-pulse rounded bg-mj-border" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
