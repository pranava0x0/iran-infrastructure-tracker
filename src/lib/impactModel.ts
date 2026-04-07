import { DataCenter, ScenarioSite, Severity, ImpactResult } from "./types";

const SEVERITY_MULTIPLIER: Record<Severity, number> = {
  Destroyed: 1.0,
  "Damaged (50%)": 0.5,
  "Offline temporarily": 0.1,
};

// $633M per 50 MW facility (Motley Fool, 2025 average DC construction cost)
const RECOVERY_COST_PER_50MW = 0.633; // in $B

// $0.8B/month per 100 MW offline (rough hyperscaler revenue density proxy)
const REVENUE_LOSS_PER_100MW_PER_MONTH = 0.8; // in $B

export function getTotalRegionalCapacityMW(sites: DataCenter[]): number {
  return sites.reduce((sum, s) => sum + (s.capacityMW ?? 0), 0);
}

export function computeImpact(
  allSites: DataCenter[],
  scenario: ScenarioSite[]
): ImpactResult {
  const totalRegionalMW = getTotalRegionalCapacityMW(allSites);
  const siteMap = new Map(allSites.map((s) => [s.id, s]));

  let totalCapitalAtRiskB = 0;
  let totalMWOffline = 0;
  let recoveryCostB = 0;
  let revenueLossB = 0;
  const unknownCapacitySites: string[] = [];

  const operatorMap = new Map<string, { sites: number; capitalB: number }>();
  const countryMap = new Map<string, { capitalB: number; mw: number }>();

  for (const entry of scenario) {
    const site = siteMap.get(entry.siteId);
    if (!site) continue;

    const mult = SEVERITY_MULTIPLIER[entry.severity];
    const mw = site.capacityMW ?? 0;
    const capital = site.commitmentUSD ?? 0;

    if (site.capacityMW === null) {
      unknownCapacitySites.push(site.site);
    }

    totalCapitalAtRiskB += capital * mult;
    totalMWOffline += mw * mult;

    // Recovery cost: (MW / 50) * $633M * severity
    recoveryCostB += (mw / 50) * RECOVERY_COST_PER_50MW * mult;

    // Revenue loss: $0.8B/month per 100 MW * duration
    revenueLossB +=
      (mw / 100) * REVENUE_LOSS_PER_100MW_PER_MONTH * entry.durationMonths * mult;

    // Operator exposure
    for (const op of site.operators) {
      const existing = operatorMap.get(op) ?? { sites: 0, capitalB: 0 };
      existing.sites += 1;
      existing.capitalB += capital * mult;
      operatorMap.set(op, existing);
    }

    // Country breakdown
    const cEntry = countryMap.get(site.country) ?? { capitalB: 0, mw: 0 };
    cEntry.capitalB += capital * mult;
    cEntry.mw += mw * mult;
    countryMap.set(site.country, cEntry);
  }

  const percentRegionalCapacity =
    totalRegionalMW > 0 ? (totalMWOffline / totalRegionalMW) * 100 : 0;

  return {
    totalCapitalAtRiskB: Math.round(totalCapitalAtRiskB * 100) / 100,
    totalMWOffline: Math.round(totalMWOffline * 10) / 10,
    percentRegionalCapacity: Math.round(percentRegionalCapacity * 10) / 10,
    operatorExposure: Array.from(operatorMap.entries())
      .map(([operator, data]) => ({
        operator,
        sites: data.sites,
        capitalB: Math.round(data.capitalB * 100) / 100,
      }))
      .sort((a, b) => b.capitalB - a.capitalB),
    recoveryCostB: Math.round(recoveryCostB * 100) / 100,
    revenueLossB: Math.round(revenueLossB * 100) / 100,
    countryBreakdown: Array.from(countryMap.entries())
      .map(([country, data]) => ({
        country,
        capitalB: Math.round(data.capitalB * 100) / 100,
        mw: Math.round(data.mw * 10) / 10,
      }))
      .sort((a, b) => b.capitalB - a.capitalB),
    unknownCapacitySites,
  };
}

export interface ScenarioPreset {
  name: string;
  description: string;
  sites: ScenarioSite[];
}

export function getPresets(allSites: DataCenter[]): ScenarioPreset[] {
  return [
    {
      name: "Mar 2026 actual",
      description: "AWS UAE + AWS Bahrain — Damaged 50%",
      sites: allSites
        .filter((s) => s.damagedMar2026)
        .map((s) => ({
          siteId: s.id,
          severity: "Damaged (50%)" as Severity,
          durationMonths: 6,
        })),
    },
    {
      name: "UAE escalation",
      description: "All UAE operational sites — Destroyed",
      sites: allSites
        .filter((s) => s.country === "UAE" && s.status === "Operational")
        .map((s) => ({
          siteId: s.id,
          severity: "Destroyed" as Severity,
          durationMonths: 24,
        })),
    },
    {
      name: "Gulf-wide",
      description: "All Operational + Under construction sites — Damaged 50%",
      sites: allSites
        .filter(
          (s) => s.status === "Operational" || s.status === "Under construction"
        )
        .map((s) => ({
          siteId: s.id,
          severity: "Damaged (50%)" as Severity,
          durationMonths: 12,
        })),
    },
  ];
}
