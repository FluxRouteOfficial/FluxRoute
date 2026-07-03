import { cn } from "@/lib/utils";

const services = [
  { label: "Image", cy: 70 },
  { label: "Text", cy: 144 },
  { label: "Data", cy: 218 },
  { label: "Compute", cy: 292 },
];

// Cubic curves fanning out from the hub's right edge to each service node.
const routes = [
  "M286,181 C 332,181 342,70 398,70",
  "M286,181 C 332,181 352,144 398,144",
  "M286,181 C 332,181 352,218 398,218",
  "M286,181 C 332,181 342,292 398,292",
];

/**
 * FluxRoute's core architecture, illustrated: a single AI agent connects to the
 * FluxRoute hub, which routes paid calls out to many microservices. Animated
 * packets flow along each route to convey live, per-call settlement.
 * Pure SVG + SMIL - no JS, theme-aware via CSS variables, decorative.
 */
export function RoutingDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 540 362"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="An AI agent connects to the FluxRoute hub, which routes paid calls to many microservices."
    >
      <defs>
        <linearGradient id="route-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity="0.75" />
        </linearGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Hub aura */}
      <circle cx="260" cy="181" r="46" fill="rgb(var(--brand) / 0.12)" filter="url(#soft)" />

      {/* Routes */}
      {routes.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="url(#route-fade)" strokeWidth="1.75" />
          <path
            d={d}
            fill="none"
            stroke="rgb(var(--brand))"
            strokeWidth="1.75"
            strokeDasharray="2 10"
            strokeLinecap="round"
            className="animate-dash-flow"
          />
          {/* Travelling payment packet */}
          <circle r="3.2" fill="rgb(var(--brand))">
            <animateMotion dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="2.6s"
              begin={`${i * 0.5}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Agent -> hub link */}
      <path d="M140,181 L232,181" stroke="url(#route-fade)" strokeWidth="1.75" fill="none" />
      <path
        d="M140,181 L232,181"
        stroke="rgb(var(--brand))"
        strokeWidth="1.75"
        strokeDasharray="2 10"
        strokeLinecap="round"
        className="animate-dash-flow"
      />

      {/* Agent node */}
      <g>
        <rect x="22" y="150" width="118" height="62" rx="12" fill="rgb(var(--panel))" stroke="rgb(var(--line-strong))" />
        <rect x="38" y="166" width="22" height="22" rx="6" fill="rgb(var(--brand) / 0.14)" stroke="rgb(var(--brand))" />
        <circle cx="45" cy="174" r="1.6" fill="rgb(var(--brand))" />
        <circle cx="53" cy="174" r="1.6" fill="rgb(var(--brand))" />
        <path d="M45,181 q4,3 8,0" stroke="rgb(var(--brand))" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <text x="70" y="178" className="fill-ink" fontSize="12" fontWeight="600">AI Agent</text>
        <text x="70" y="192" className="fill-faint" fontSize="9" fontFamily="var(--font-mono)">MCP client</text>
      </g>

      {/* Hub node */}
      <g>
        <circle cx="260" cy="181" r="30" fill="rgb(var(--brand))" />
        <circle cx="260" cy="181" r="30" fill="none" stroke="rgb(var(--brand-contrast) / 0.25)" />
        {/* mini routing glyph */}
        <path
          d="M260,181 L274,170 M260,181 L274,192 M260,181 L247,181"
          stroke="rgb(var(--brand-contrast))"
          strokeOpacity="0.6"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="274" cy="170" r="1.8" fill="rgb(var(--brand-contrast))" />
        <circle cx="274" cy="192" r="1.8" fill="rgb(var(--brand-contrast))" />
        <circle cx="247" cy="181" r="1.8" fill="rgb(var(--brand-contrast))" />
        <circle cx="260" cy="181" r="3.4" fill="rgb(var(--brand-contrast))" />
        {/* pulsing ring */}
        <circle cx="260" cy="181" r="30" fill="none" stroke="rgb(var(--brand))" strokeWidth="1.5">
          <animate attributeName="r" values="30;46" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <text x="260" y="232" textAnchor="middle" className="fill-ink" fontSize="12" fontWeight="700">FluxRoute</text>
      </g>

      {/* Service nodes */}
      {services.map((s) => (
        <g key={s.label}>
          <rect
            x="400"
            y={s.cy - 21}
            width="118"
            height="42"
            rx="11"
            fill="rgb(var(--panel))"
            stroke="rgb(var(--line-strong))"
          />
          <circle cx="416" cy={s.cy} r="3" fill="rgb(var(--brand))" />
          <text x="430" y={s.cy + 4} className="fill-ink" fontSize="11" fontWeight="600">
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
