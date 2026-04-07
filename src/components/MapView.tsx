"use client";

import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { dataCenters } from "@/data/dataCenters";
import { DataCenter } from "@/lib/types";
import { formatUSD, formatMW } from "@/lib/utils";
import SiteDetailPanel from "./SiteDetailPanel";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS: Record<string, string> = {
  Operational: "#22c55e",
  "Under construction": "#f59e0b",
  Planned: "#3b82f6",
};

const CONFIDENCE_COLORS: Record<string, string> = {
  Confirmed: "#22c55e",
  Reported: "#f59e0b",
  Estimated: "#ef4444",
};

function getRadius(mw: number | null): number {
  if (mw === null || mw === 0) return 6;
  return Math.max(6, Math.min(30, 4 + Math.log2(mw) * 3));
}

function MapEvents({ onSiteClick }: { onSiteClick: (s: DataCenter) => void }) {
  return null;
}

export default function MapView() {
  const [selected, setSelected] = useState<DataCenter | null>(null);

  return (
    <div className="relative flex h-[calc(100vh-3rem)]">
      <div className={`flex-1 transition-all ${selected ? "mr-0 sm:mr-96" : ""}`}>
        <MapContainer
          center={[25.5, 48]}
          zoom={5}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {dataCenters.map((site) => (
            <CircleMarker
              key={site.id}
              center={[site.lat, site.lng]}
              radius={getRadius(site.capacityMW)}
              pathOptions={{
                color: site.damagedMar2026 ? "#ef4444" : STATUS_COLORS[site.status] ?? "#6b7280",
                fillColor: STATUS_COLORS[site.status] ?? "#6b7280",
                fillOpacity: 0.6,
                weight: site.damagedMar2026 ? 3 : 2,
              }}
              eventHandlers={{
                click: () => setSelected(site),
              }}
            >
              <Tooltip>
                <div className="text-xs">
                  <p className="font-bold">{site.site}</p>
                  <p>{formatMW(site.capacityMW)} · {formatUSD(site.commitmentUSD)}</p>
                  <p className="capitalize">{site.status}</p>
                  {site.damagedMar2026 && (
                    <p className="font-bold text-red-600">Damaged — Mar 2026</p>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Pulsing rings for damaged sites */}
          {dataCenters
            .filter((s) => s.damagedMar2026)
            .map((site) => (
              <CircleMarker
                key={`pulse-${site.id}`}
                center={[site.lat, site.lng]}
                radius={getRadius(site.capacityMW) + 8}
                pathOptions={{
                  color: "#ef4444",
                  fillColor: "transparent",
                  fillOpacity: 0,
                  weight: 2,
                  opacity: 0.5,
                  dashArray: "4 4",
                }}
              />
            ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[500] rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </p>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {status}
          </div>
        ))}
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-red-500 bg-transparent" />
          Damaged (Mar 2026)
        </div>
        <p className="mt-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Size = MW capacity (log)
        </p>
      </div>

      {/* Detail panel */}
      {selected && (
        <SiteDetailPanel site={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
