"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { dataCenters } from "@/data/dataCenters";
import { DataCenter } from "@/lib/types";
import { formatMW } from "@/lib/utils";
import { useIsMobile } from "@/lib/useDeviceType";
import SiteDetailPanel from "./SiteDetailPanel";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS: Record<string, string> = {
  Operational: "#22c55e",
  "Under construction": "#f59e0b",
  Planned: "#3b82f6",
};

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

const MARKER_RADIUS = 7;

export default function MapView() {
  const [selected, setSelected] = useState<DataCenter | null>(null);
  const [dark, setDark] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Mobile: 3rem top nav + 4rem bottom nav = 7rem; Desktop: 3rem top nav only
  const mapHeight = isMobile ? "h-[calc(100vh-7rem)]" : "h-[calc(100vh-3rem)]";

  return (
    <div className={`relative flex ${mapHeight}`}>
      <div className={`flex-1 transition-all ${selected && !isMobile ? "sm:mr-96" : ""}`}>
        <MapContainer
          center={[25.5, 48]}
          zoom={isMobile ? 4 : 5}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer key={dark ? "dark" : "light"} attribution={TILE_ATTR} url={dark ? TILE_DARK : TILE_LIGHT} />
          {dataCenters.map((site) => (
            <CircleMarker
              key={site.id}
              center={[site.lat, site.lng]}
              radius={MARKER_RADIUS}
              pathOptions={{
                color: site.damagedMar2026 ? "#ef4444" : STATUS_COLORS[site.status] ?? "#6b7280",
                fillColor: STATUS_COLORS[site.status] ?? "#6b7280",
                fillOpacity: 0.7,
                weight: site.damagedMar2026 ? 2.5 : 1.5,
              }}
              eventHandlers={{
                click: () => setSelected(site),
              }}
            >
              <Tooltip>
                <div className="text-xs">
                  <p className="font-bold">{site.site}</p>
                  <p>{formatMW(site.capacityMW)} · {site.status}</p>
                  {site.damagedMar2026 && (
                    <p className="font-bold text-red-600">Damaged</p>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[500] flex items-center gap-3 rounded-full border border-border bg-card/90 px-3 py-1.5 text-[11px] backdrop-blur">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="hidden sm:inline">{status}</span>
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full border-[1.5px] border-red-500 bg-transparent" />
          <span className="hidden sm:inline">Damaged</span>
        </span>
      </div>

      {/* Detail panel */}
      {selected && (
        <SiteDetailPanel site={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
