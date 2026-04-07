import { describe, it, expect } from "vitest";
import { formatUSD, formatMW, cn } from "@/lib/utils";

describe("formatMW", () => {
  it("returns 'Unknown' for null", () => {
    expect(formatMW(null)).toBe("Unknown");
  });

  it("formats GW for values >= 1000 (uses .toFixed(1))", () => {
    expect(formatMW(1000)).toBe("1.0 GW");
    expect(formatMW(2500)).toBe("2.5 GW");
    expect(formatMW(1500)).toBe("1.5 GW");
  });

  it("formats MW for values < 1000", () => {
    expect(formatMW(500)).toBe("500 MW");
    expect(formatMW(50)).toBe("50 MW");
    expect(formatMW(0)).toBe("0 MW");
  });
});

// formatUSD takes values already in billions (e.g. 5 = $5B, 0.5 = $500M)
describe("formatUSD", () => {
  it("returns 'N/A' for null", () => {
    expect(formatUSD(null)).toBe("N/A");
  });

  it("formats whole billions", () => {
    expect(formatUSD(5)).toBe("$5B");
    expect(formatUSD(1)).toBe("$1B");
  });

  it("formats fractional billions as millions", () => {
    // < 1B → convert to M via Math.round(val * 1000)
    expect(formatUSD(0.5)).toBe("$500M");
    expect(formatUSD(0.1)).toBe("$100M");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "excluded", "included")).toBe("base included");
  });

  it("deduplicates tailwind classes (last wins)", () => {
    // tailwind-merge behaviour: later class wins for same utility
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
