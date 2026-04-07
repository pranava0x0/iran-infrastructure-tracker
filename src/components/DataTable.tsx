"use client";

import { useState, useMemo } from "react";
import { dataCenters } from "@/data/dataCenters";
import { DataCenter, SiteStatus, Confidence } from "@/lib/types";
import { formatUSD, formatMW, cn } from "@/lib/utils";
import { Download, ExternalLink, Filter, X } from "lucide-react";

const ALL_COUNTRIES = [...new Set(dataCenters.map((s) => s.country))].sort();
const ALL_STATUSES: SiteStatus[] = [
  "Operational",
  "Under construction",
  "Planned",
];
const ALL_CONFIDENCES: Confidence[] = ["Confirmed", "Reported", "Estimated"];
const ALL_OPERATORS = [
  ...new Set(dataCenters.flatMap((s) => s.operators)),
].sort();

const STATUS_BADGE: Record<string, string> = {
  Operational: "bg-green-500/20 text-green-400",
  "Under construction": "bg-amber-500/20 text-amber-400",
  Planned: "bg-blue-500/20 text-blue-400",
};

const CONFIDENCE_BADGE: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-400",
  Reported: "bg-amber-500/20 text-amber-400",
  Estimated: "bg-red-500/20 text-red-400",
};

type SortKey =
  | "country"
  | "site"
  | "capacityMW"
  | "commitmentUSD"
  | "status";

export default function DataTable() {
  const [countries, setCountries] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<SiteStatus[]>([]);
  const [confidences, setConfidences] = useState<Confidence[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("country");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = dataCenters;
    if (countries.length > 0)
      result = result.filter((s) => countries.includes(s.country));
    if (statuses.length > 0)
      result = result.filter((s) => statuses.includes(s.status));
    if (confidences.length > 0)
      result = result.filter((s) => confidences.includes(s.confidence));
    if (operators.length > 0)
      result = result.filter((s) =>
        s.operators.some((op) => operators.includes(op))
      );

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "country":
          cmp = a.country.localeCompare(b.country);
          break;
        case "site":
          cmp = a.site.localeCompare(b.site);
          break;
        case "capacityMW":
          cmp = (a.capacityMW ?? -1) - (b.capacityMW ?? -1);
          break;
        case "commitmentUSD":
          cmp = (a.commitmentUSD ?? -1) - (b.commitmentUSD ?? -1);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [countries, statuses, confidences, operators, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Country",
      "Site",
      "City",
      "Operators",
      "Capacity (MW)",
      "Commitment",
      "Status",
      "Confidence",
    ];
    const rows = filtered.map((s) => [
      s.country,
      s.site,
      s.city,
      s.operators.join("; "),
      s.capacityMW?.toString() ?? "N/A",
      s.commitmentLabel,
      s.status,
      s.confidence,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "me-dc-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFilter = <T,>(arr: T[], val: T, setter: (v: T[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const activeFilterCount =
    countries.length + statuses.length + confidences.length + operators.length;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Data Table</h1>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {dataCenters.length} sites
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent",
              showFilters && "bg-accent"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 grid gap-3 rounded-lg border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterGroup
            label="Country"
            options={ALL_COUNTRIES}
            selected={countries}
            onToggle={(v) => toggleFilter(countries, v, setCountries)}
          />
          <FilterGroup
            label="Status"
            options={ALL_STATUSES}
            selected={statuses}
            onToggle={(v) => toggleFilter(statuses, v as SiteStatus, setStatuses)}
          />
          <FilterGroup
            label="Confidence"
            options={ALL_CONFIDENCES}
            selected={confidences}
            onToggle={(v) =>
              toggleFilter(confidences, v as Confidence, setConfidences)
            }
          />
          <FilterGroup
            label="Operator"
            options={ALL_OPERATORS}
            selected={operators}
            onToggle={(v) => toggleFilter(operators, v, setOperators)}
            maxHeight="max-h-32"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
                  {/* Always visible columns */}
              {(
                [
                  ["country", "Country", ""],
                  ["site", "Site", ""],
                  ["capacityMW", "MW", ""],
                  ["status", "Status", ""],
                ] as [SortKey, string, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="cursor-pointer px-3 py-2 text-left font-medium hover:text-foreground"
                >
                  {label}
                  {sortKey === key && (sortAsc ? " ↑" : " ↓")}
                </th>
              ))}
              {/* Hidden on mobile */}
              <th
                onClick={() => handleSort("commitmentUSD")}
                className="hidden cursor-pointer px-3 py-2 text-left font-medium hover:text-foreground sm:table-cell"
              >
                Commitment{sortKey === "commitmentUSD" && (sortAsc ? " ↑" : " ↓")}
              </th>
              <th className="hidden px-3 py-2 text-left font-medium sm:table-cell">Confidence</th>
              <th className="hidden px-3 py-2 text-left font-medium md:table-cell">Operators</th>
              <th className="px-3 py-2 text-left font-medium">Sources</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((site) => (
              <tr
                key={site.id}
                className={cn(
                  "border-b border-border last:border-0 hover:bg-muted/30",
                  site.damagedMar2026 && "bg-red-500/5"
                )}
              >
                <td className="px-3 py-2 font-medium">{site.country}</td>
                <td className="px-3 py-2">
                  <div>
                    {site.site}
                    {site.damagedMar2026 && (
                      <span className="ml-1 text-[9px] text-red-400">
                        DAMAGED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {site.city}
                  </div>
                </td>
                <td className="px-3 py-2 tabular-nums">
                  {formatMW(site.capacityMW)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      STATUS_BADGE[site.status]
                    )}
                  >
                    {site.status}
                  </span>
                </td>
                {/* Hidden on mobile */}
                <td className="hidden px-3 py-2 sm:table-cell">{site.commitmentLabel}</td>
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      CONFIDENCE_BADGE[site.confidence]
                    )}
                  >
                    {site.confidence}
                  </span>
                </td>
                <td className="hidden px-3 py-2 md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {site.operators.slice(0, 3).map((op) => (
                      <span
                        key={op}
                        className="rounded bg-accent px-1 py-0.5 text-[9px]"
                      >
                        {op}
                      </span>
                    ))}
                    {site.operators.length > 3 && (
                      <span className="text-[9px] text-muted-foreground">
                        +{site.operators.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  {site.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                      title={src.label}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
  maxHeight,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  maxHeight?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className={cn("flex flex-wrap gap-1 overflow-y-auto", maxHeight)}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] transition-colors",
              selected.includes(opt)
                ? "border-primary bg-primary/20 text-primary"
                : "border-border hover:bg-accent"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
