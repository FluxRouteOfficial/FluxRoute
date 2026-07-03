/** Skeleton shown while a dashboard route loads, inside the sidebar layout. */
export default function DashboardLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="skeleton h-7 w-48 rounded-lg" />
        <div className="skeleton h-4 w-72 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton mb-3 h-9 w-9 rounded-lg" />
            <div className="skeleton mb-2 h-7 w-24 rounded-md" />
            <div className="skeleton h-3 w-28 rounded-md" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card overflow-hidden lg:col-span-3">
          <div className="border-b border-line px-5 py-4">
            <div className="skeleton h-4 w-32 rounded-md" />
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <div className="skeleton mb-4 h-14 w-14 rounded-2xl" />
            <div className="skeleton mb-2 h-5 w-44 rounded-md" />
            <div className="skeleton h-4 w-64 rounded-md" />
          </div>
        </div>
        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-line px-5 py-4">
            <div className="skeleton h-4 w-24 rounded-md" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-line px-5 py-4 last:border-0">
              <div className="flex items-center gap-4">
                <div className="skeleton h-8 w-8 flex-shrink-0 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-36 rounded-md" />
                  <div className="skeleton h-3 w-52 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
