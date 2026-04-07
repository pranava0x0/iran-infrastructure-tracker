"use client";

import { ImpactResult } from "@/lib/types";
import { formatUSD } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertTriangle } from "lucide-react";

const COUNTRY_COLORS: Record<string, string> = {
  UAE: "#3b82f6",
  "Saudi Arabia": "#22c55e",
  Qatar: "#a855f7",
  Bahrain: "#f59e0b",
  Israel: "#06b6d4",
  Kuwait: "#ec4899",
  Oman: "#f97316",
};

export default function ImpactSummary({ impact }: { impact: ImpactResult }) {
  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-[10px] leading-relaxed text-amber-200/80">
          Model estimate — rough proxy only. Recovery costs based on Motley Fool
          2025 avg DC construction ($633M/50 MW). Revenue loss uses $0.8B/mo per
          100 MW (hyperscaler density proxy).
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-2">
        <KPI label="Capital at Risk" value={`$${impact.totalCapitalAtRiskB}B`} />
        <KPI label="MW Offline" value={`${impact.totalMWOffline} MW`} />
        <KPI
          label="% Regional Capacity"
          value={`${impact.percentRegionalCapacity}%`}
        />
        <KPI label="Est. Recovery Cost" value={`$${impact.recoveryCostB}B`} />
        <KPI
          label="Est. Revenue Loss"
          value={`$${impact.revenueLossB}B`}
          className="col-span-2"
        />
      </div>

      {/* Unknown capacity warning */}
      {impact.unknownCapacitySites.length > 0 && (
        <p className="text-[10px] text-muted-foreground">
          Capacity unknown for {impact.unknownCapacitySites.length} site(s) —
          financial impact only:{" "}
          {impact.unknownCapacitySites.slice(0, 3).join(", ")}
          {impact.unknownCapacitySites.length > 3 && "..."}
        </p>
      )}

      {/* Bar chart: $ at risk by country */}
      {impact.countryBreakdown.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold">Capital at Risk by Country</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impact.countryBreakdown}>
                <XAxis
                  dataKey="country"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}B`}
                />
                <Tooltip
                  formatter={(v) => [`$${v}B`, "Capital"]}
                  contentStyle={{
                    fontSize: 11,
                    background: "hsl(222 47% 9%)",
                    border: "1px solid hsl(217 33% 17%)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="capitalB" radius={[4, 4, 0, 0]}>
                  {impact.countryBreakdown.map((entry) => (
                    <Cell
                      key={entry.country}
                      fill={COUNTRY_COLORS[entry.country] ?? "#6b7280"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Operator exposure table */}
      {impact.operatorExposure.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold">Operator Exposure</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-1.5 text-left font-medium">Operator</th>
                  <th className="px-3 py-1.5 text-right font-medium">Sites</th>
                  <th className="px-3 py-1.5 text-right font-medium">Capital ($B)</th>
                </tr>
              </thead>
              <tbody>
                {impact.operatorExposure.map((row) => (
                  <tr key={row.operator} className="border-b border-border last:border-0">
                    <td className="px-3 py-1.5">{row.operator}</td>
                    <td className="px-3 py-1.5 text-right">{row.sites}</td>
                    <td className="px-3 py-1.5 text-right">
                      {row.capitalB > 0 ? `$${row.capitalB}B` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-card p-3 ${className ?? ""}`}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums">{value}</p>
    </div>
  );
}
