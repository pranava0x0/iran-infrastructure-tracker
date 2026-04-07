import { describe, it, expect } from "vitest";
import { computeImpact, getTotalRegionalCapacityMW, getPresets } from "@/lib/impactModel";
import { dataCenters } from "@/data/dataCenters";
import { DataCenter, ScenarioSite } from "@/lib/types";

// Minimal fake site for isolation tests
const fakeSite: DataCenter = {
  id: "test-1",
  country: "UAE",
  site: "Test DC",
  city: "Dubai",
  lat: 25.2,
  lng: 55.3,
  operators: ["TestCorp"],
  capacityMW: 100,
  commitmentUSD: 1_000_000_000,
  commitmentLabel: "$1B",
  status: "Operational",
  confidence: "Confirmed",
  damagedMar2026: false,
  notes: "",
  sources: [],
};

describe("getTotalRegionalCapacityMW", () => {
  it("returns a positive number for real data", () => {
    expect(getTotalRegionalCapacityMW(dataCenters)).toBeGreaterThan(0);
  });

  it("returns 0 for empty array", () => {
    expect(getTotalRegionalCapacityMW([])).toBe(0);
  });

  it("sums known capacity, skips nulls", () => {
    const sites: DataCenter[] = [
      { ...fakeSite, id: "a", capacityMW: 200 },
      { ...fakeSite, id: "b", capacityMW: null },
      { ...fakeSite, id: "c", capacityMW: 300 },
    ];
    expect(getTotalRegionalCapacityMW(sites)).toBe(500);
  });
});

describe("computeImpact", () => {
  it("returns zero impact for empty scenario", () => {
    const result = computeImpact(dataCenters, []);
    expect(result.totalCapitalAtRiskB).toBe(0);
    expect(result.totalMWOffline).toBe(0);
    expect(result.percentRegionalCapacity).toBe(0);
    expect(result.operatorExposure).toHaveLength(0);
    expect(result.countryBreakdown).toHaveLength(0);
  });

  it("Destroyed severity = 100% MW offline", () => {
    const scenario: ScenarioSite[] = [
      { siteId: fakeSite.id, severity: "Destroyed", durationMonths: 12 },
    ];
    const result = computeImpact([fakeSite], scenario);
    expect(result.totalMWOffline).toBe(100);
  });

  it("Damaged (50%) severity = 50% MW offline", () => {
    const scenario: ScenarioSite[] = [
      { siteId: fakeSite.id, severity: "Damaged (50%)", durationMonths: 6 },
    ];
    const result = computeImpact([fakeSite], scenario);
    expect(result.totalMWOffline).toBe(50);
  });

  it("Offline temporarily severity = 10% MW offline", () => {
    const scenario: ScenarioSite[] = [
      { siteId: fakeSite.id, severity: "Offline temporarily", durationMonths: 3 },
    ];
    const result = computeImpact([fakeSite], scenario);
    expect(result.totalMWOffline).toBe(10);
  });

  it("tracks operator exposure correctly", () => {
    const scenario: ScenarioSite[] = [
      { siteId: fakeSite.id, severity: "Destroyed", durationMonths: 12 },
    ];
    const result = computeImpact([fakeSite], scenario);
    const exposure = result.operatorExposure.find((e) => e.operator === "TestCorp");
    expect(exposure).toBeDefined();
    expect(exposure!.sites).toBe(1);
  });

  it("tracks country breakdown correctly", () => {
    const scenario: ScenarioSite[] = [
      { siteId: fakeSite.id, severity: "Destroyed", durationMonths: 12 },
    ];
    const result = computeImpact([fakeSite], scenario);
    const uae = result.countryBreakdown.find((c) => c.country === "UAE");
    expect(uae).toBeDefined();
  });

  it("site not in scenario has no impact", () => {
    const otherSite: DataCenter = { ...fakeSite, id: "other-site" };
    const scenario: ScenarioSite[] = [
      { siteId: "does-not-exist", severity: "Destroyed", durationMonths: 12 },
    ];
    const result = computeImpact([otherSite], scenario);
    expect(result.totalMWOffline).toBe(0);
  });

  it("unknown capacity sites are tracked", () => {
    const nullCapSite: DataCenter = { ...fakeSite, id: "null-cap", capacityMW: null };
    const scenario: ScenarioSite[] = [
      { siteId: "null-cap", severity: "Destroyed", durationMonths: 12 },
    ];
    const result = computeImpact([nullCapSite], scenario);
    expect(result.unknownCapacitySites).toContain("Test DC");
    expect(result.totalMWOffline).toBe(0);
  });
});

describe("getPresets", () => {
  it("returns at least one preset", () => {
    const presets = getPresets(dataCenters);
    expect(presets.length).toBeGreaterThan(0);
  });

  it("each preset has name and sites array", () => {
    const presets = getPresets(dataCenters);
    for (const preset of presets) {
      expect(preset.name).toBeTruthy();
      expect(Array.isArray(preset.sites)).toBe(true);
    }
  });

  it("all preset site IDs exist in dataCenters", () => {
    const ids = new Set(dataCenters.map((s) => s.id));
    const presets = getPresets(dataCenters);
    for (const preset of presets) {
      for (const entry of preset.sites) {
        expect(ids.has(entry.siteId)).toBe(true);
      }
    }
  });
});
