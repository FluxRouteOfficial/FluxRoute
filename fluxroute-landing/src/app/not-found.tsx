import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/Logo";
import { GridBackdrop } from "@/components/decor/Backdrops";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      <GridBackdrop />
      <div className="relative">
        <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel shadow-elevate">
          <LogoMark className="h-8 w-8" />
        </span>
        <p className="font-mono text-body-sm uppercase tracking-[0.2em] text-brand">Error 404</p>
        <h1 className="mt-3 text-display font-semibold tracking-tight text-ink">No route found</h1>
        <p className="mx-auto mt-3 max-w-sm text-body text-dim">
          This endpoint isn&apos;t in the registry. Let&apos;s route you back to
          somewhere that exists.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/" variant="brand" size="md">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
