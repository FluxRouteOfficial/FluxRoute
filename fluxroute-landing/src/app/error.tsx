"use client";

import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GridBackdrop } from "@/components/decor/Backdrops";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-6 text-center">
      <GridBackdrop />
      <div className="relative">
        <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel text-brand shadow-elevate">
          <TriangleAlert size={24} strokeWidth={1.75} />
        </span>
        <h1 className="text-heading-1 font-semibold text-ink">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-sm text-body text-dim">
          An unexpected error interrupted the route. You can retry the request
          or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} variant="brand" size="md">
            <RotateCw size={16} />
            Try again
          </Button>
          <Button href="/" variant="secondary" size="md">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
