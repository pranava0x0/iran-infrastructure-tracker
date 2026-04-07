"use client";

import { useState, useMemo } from "react";
import { dataCenters } from "@/data/dataCenters";
import { ScenarioSite, Severity } from "@/lib/types";
import { computeImpact, getPresets } from "@/lib/impactModel";
import { formatUSD, cn } from "@/lib/utils";
import ImpactSummary from "./ImpactSummary";
import { Plus, Trash2, Zap } from "lucide-react";

const SEVERITIES: Severity[] = [
  "Destroyed",
  "Damaged (50%)",
  "Offline temporarily",
];

export default function ScenarioBuilder() {
  const [scenario, setScenario] = useState<ScenarioSite[]>([]);
  const presets = useMemo(() => getPresets(dataCenters), []);

  const impact = useMemo(
    () => computeImpact(dataCenters, scenario),
    [scenario]
  );

  const selectedIds = new Set(scenario.map((s) => s.siteId));

  const addSite = (siteId: string) => {
    if (selectedIds.has(siteId)) return;
    setScenario((prev) => [
      ...prev,
      { siteId, severity: "Damaged (50%)", durationMonths: 6 },
    ]);
  };

  const removeSite = (siteId: string) => {
    setScenario((prev) => prev.filter((s) => s.siteId !== siteId));
  };

  const updateSite = (siteId: string, updates: Partial<ScenarioSite>) => {
    setScenario((prev) =>
      prev.map((s) => (s.siteId === siteId ? { ...s, ...updates } : s))
    );
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    setScenario(preset.sites);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 pb-20 sm:pb-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Strike Scenario Builder</h1>
        <p className="text-xs text-muted-foreground">
          Select sites, set severity/duration, and view estimated impact.
        </p>
      </div>

      {/* Presets */}
      <div className="mb-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Presets
        </h2>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              <Zap className="h-3 w-3 text-amber-500" />
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setScenario([])}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site selector + scenario table */}
        <div>
          {/* Add site */}
          <div className="mb-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Add Site
            </h2>
            <select
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-xs"
              value=""
              onChange={(e) => {
                if (e.target.value) addSite(e.target.value);
              }}
            >
              <option value="">Select a site to add...</option>
              {dataCenters
                .filter((s) => !selectedIds.has(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.country} — {s.site}
                  </option>
                ))}
            </select>
          </div>

          {/* Scenario entries */}
          <div className="space-y-2">
            {scenario.length === 0 && (
              <p className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                No sites selected. Choose a preset or add sites manually.
              </p>
            )}
            {scenario.map((entry) => {
              const site = dataCenters.find((s) => s.id === entry.siteId);
              if (!site) return null;
              return (
                <div
                  key={entry.siteId}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold">{site.site}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {site.country} · {site.city}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSite(entry.siteId)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-0.5 block text-[10px] text-muted-foreground">
                        Severity
                      </label>
                      <select
                        className="w-full rounded border border-border bg-background px-2 py-1 text-xs"
                        value={entry.severity}
                        onChange={(e) =>
                          updateSite(entry.siteId, {
                            severity: e.target.value as Severity,
                          })
                        }
                      >
                        {SEVERITIES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-0.5 block text-[10px] text-muted-foreground">
                        Duration: {entry.durationMonths} mo
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={36}
                        value={entry.durationMonths}
                        onChange={(e) =>
                          updateSite(entry.siteId, {
                            durationMonths: parseInt(e.target.value),
                          })
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact summary */}
        <div>
          {scenario.length > 0 && <ImpactSummary impact={impact} />}
        </div>
      </div>
    </div>
  );
}
