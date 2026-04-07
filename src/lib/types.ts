export type SiteStatus = "Operational" | "Under construction" | "Planned";
export type Confidence = "Confirmed" | "Reported" | "Estimated";
export type Severity = "Destroyed" | "Damaged (50%)" | "Offline temporarily";

export interface DataCenter {
  id: string;
  country: string;
  site: string;
  city: string;
  lat: number;
  lng: number;
  operators: string[];
  capacityMW: number | null;
  commitmentUSD: number | null;
  commitmentLabel: string;
  status: SiteStatus;
  confidence: Confidence;
  damagedMar2026: boolean;
  notes: string;
  sources: { label: string; url: string }[];
}

export interface ScenarioSite {
  siteId: string;
  severity: Severity;
  durationMonths: number;
}

export interface ImpactResult {
  totalCapitalAtRiskB: number;
  totalMWOffline: number;
  percentRegionalCapacity: number;
  operatorExposure: { operator: string; sites: number; capitalB: number }[];
  recoveryCostB: number;
  revenueLossB: number;
  countryBreakdown: { country: string; capitalB: number; mw: number }[];
  unknownCapacitySites: string[];
}
