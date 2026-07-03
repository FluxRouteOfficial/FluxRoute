/** Skeleton shown while a dashboard route loads, inside the sidebar layout. */
export default function DashboardLoading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-7 w-48 rounded-md" />
        <div className="skeleton h-4 w-72 rounded-md" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton mb-3 h-9 w-9 rounded-lg" />
            <div className="skeleton mb-2 h-7 w-24 rounded-md" />
            <div className="skeleton h-3 w-28 rounded-md" />
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <div className="skeleton h-4 w-32 rounded-md" />
        </div>
        <div className="divide-y divide-line">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div className="space-y-2">
                <div className="skeleton h-4 w-40 rounded-md" />
                <div className="skeleton h-3 w-24 rounded-md" />
              </div>
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
