import { LogoMark } from "@/components/Logo";

/** Branded loading state — a calm skeleton rather than a bare spinner. */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-canvas px-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-brand/30" />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel shadow-elevate">
          <LogoMark className="h-8 w-8" />
        </span>
      </div>

      <div className="w-full max-w-sm space-y-3" aria-hidden>
        <div className="skeleton mx-auto h-3 w-2/3 rounded-full" />
        <div className="skeleton mx-auto h-3 w-1/2 rounded-full" />
        <div className="skeleton mx-auto h-3 w-3/5 rounded-full" />
      </div>

      <p className="text-body-sm text-faint">Routing your request…</p>
    </div>
  );
}
