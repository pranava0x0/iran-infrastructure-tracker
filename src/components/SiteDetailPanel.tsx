"use client";

import { DataCenter } from "@/lib/types";
import { formatUSD, formatMW, cn } from "@/lib/utils";
import { X, ExternalLink } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  Operational: "bg-green-500/20 text-green-400 border-green-500/30",
  "Under construction": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const CONFIDENCE_BADGE: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  Reported: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Estimated: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function SiteDetailPanel({
  site,
  onClose,
}: {
  site: DataCenter;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className="fixed inset-0 z-[590] bg-black/40 backdrop-blur-sm sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel:
          Mobile  → fixed bottom sheet, full width, 65vh, rounded top corners
          Desktop → absolute right sidebar, w-96, full map height */}
      <div
        className={cn(
          "z-[600] overflow-y-auto bg-card",
          // Mobile: bottom sheet
          "fixed bottom-0 left-0 right-0 h-[65vh] rounded-t-2xl border-t border-border",
          // Desktop: right sidebar
          "sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-96 sm:rounded-none sm:border-l sm:border-t-0"
        )}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="h-[3px] w-10 rounded-full bg-border" />
        </div>

        {/* Sticky header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <h2 className="text-sm font-bold leading-tight">{site.site}</h2>
          <button
            onClick={onClose}
            className="ml-2 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                STATUS_BADGE[site.status]
              )}
            >
              {site.status}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                CONFIDENCE_BADGE[site.confidence]
              )}
            >
              {site.confidence}
            </span>
            {site.damagedMar2026 && (
              <span className="rounded-full border border-red-500/30 bg-red-500/20 px-2.5 py-0.5 text-[10px] font-medium text-red-400">
                Damaged — Mar 2026
              </span>
            )}
          </div>

          {/* Details */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <dt className="text-muted-foreground">Country</dt>
            <dd>{site.country}</dd>
            <dt className="text-muted-foreground">City</dt>
            <dd>{site.city}</dd>
            <dt className="text-muted-foreground">Coordinates</dt>
            <dd>
              {site.lat.toFixed(2)}, {site.lng.toFixed(2)}
            </dd>
            <dt className="text-muted-foreground">Capacity</dt>
            <dd>{formatMW(site.capacityMW)}</dd>
            <dt className="text-muted-foreground">Commitment</dt>
            <dd>{site.commitmentLabel}</dd>
            <dt className="text-muted-foreground">Operators</dt>
            <dd className="col-span-2 mt-0.5">
              <div className="flex flex-wrap gap-1">
                {site.operators.map((op) => (
                  <span
                    key={op}
                    className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium"
                  >
                    {op}
                  </span>
                ))}
              </div>
            </dd>
          </dl>

          {/* Notes */}
          {site.notes && (
            <div>
              <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {site.notes}
              </p>
            </div>
          )}

          {/* Sources */}
          <div>
            <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sources
            </h3>
            <ul className="space-y-1">
              {site.sources.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
