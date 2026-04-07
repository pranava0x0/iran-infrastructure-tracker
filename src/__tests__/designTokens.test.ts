/**
 * Design token sanity checks.
 * Ensures the CSS custom properties we defined in globals.css are correctly
 * structured and that the Tailwind token mapping in tailwind.config.ts
 * references the expected variables.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const globalsCSS = fs.readFileSync(
  path.resolve(__dirname, "../../src/app/globals.css"),
  "utf-8"
);

const tailwindConfig = fs.readFileSync(
  path.resolve(__dirname, "../../tailwind.config.ts"),
  "utf-8"
);

describe("globals.css — CSS custom properties", () => {
  const requiredLightVars = [
    "--background",
    "--foreground",
    "--card",
    "--card-foreground",
    "--border",
    "--muted",
    "--muted-foreground",
    "--accent",
    "--destructive",
    "--primary",
    "--primary-foreground",
  ];

  for (const variable of requiredLightVars) {
    it(`light mode defines ${variable}`, () => {
      // Find the :root block
      const rootBlock = globalsCSS.match(/:root\s*\{([^}]+)\}/s)?.[1] ?? "";
      expect(rootBlock).toContain(variable);
    });
  }

  for (const variable of requiredLightVars) {
    it(`dark mode defines ${variable}`, () => {
      const darkBlock = globalsCSS.match(/\.dark\s*\{([^}]+)\}/s)?.[1] ?? "";
      expect(darkBlock).toContain(variable);
    });
  }

  it("dark --background is warm (hue ~27–35), not cold navy", () => {
    const darkBlock = globalsCSS.match(/\.dark\s*\{([^}]+)\}/s)?.[1] ?? "";
    const bgLine = darkBlock.split("\n").find((l) => l.trim().startsWith("--background:"));
    expect(bgLine).toBeTruthy();

    // Extract the hue value from "HHH SS% LL%"
    const hue = parseInt(bgLine!.split(":")[1].trim().split(" ")[0]);
    // Should be in warm range (20–40), NOT cold navy (~215–230)
    expect(hue).toBeGreaterThanOrEqual(20);
    expect(hue).toBeLessThanOrEqual(45);
  });

  it("has Leaflet dark override for .dark .leaflet-container", () => {
    expect(globalsCSS).toContain(".dark .leaflet-container");
  });

  it("has bottom-nav safe-area support", () => {
    expect(globalsCSS).toContain("safe-area-inset-bottom");
  });
});

describe("tailwind.config.ts — token mapping", () => {
  const expectedTokens = [
    "background",
    "foreground",
    "card",
    "border",
    "muted",
    "accent",
    "destructive",
    "primary",
  ];

  for (const token of expectedTokens) {
    it(`maps '${token}' to CSS variable`, () => {
      expect(tailwindConfig).toContain(`${token}:`);
      expect(tailwindConfig).toContain(`--${token}`);
    });
  }

  it("uses 'class' dark mode strategy", () => {
    expect(tailwindConfig).toContain(`darkMode: "class"`);
  });
});

describe("NavBar.tsx — responsive structure", () => {
  const navBar = fs.readFileSync(
    path.resolve(__dirname, "../../src/components/NavBar.tsx"),
    "utf-8"
  );

  it("has a bottom nav element for mobile", () => {
    expect(navBar).toContain("sm:hidden");
    expect(navBar).toContain("fixed bottom-0");
  });

  it("hides desktop links on mobile", () => {
    expect(navBar).toContain("hidden");
    expect(navBar).toContain("sm:flex");
  });

  it("has theme toggle button", () => {
    expect(navBar).toContain("toggleTheme");
    expect(navBar).toContain("Toggle theme");
  });

  it("has aria-label on theme toggle", () => {
    expect(navBar).toContain('aria-label="Toggle theme"');
  });
});

describe("SiteDetailPanel.tsx — responsive structure", () => {
  const panel = fs.readFileSync(
    path.resolve(__dirname, "../../src/components/SiteDetailPanel.tsx"),
    "utf-8"
  );

  it("uses fixed positioning for mobile bottom sheet", () => {
    expect(panel).toContain("fixed bottom-0");
  });

  it("switches to absolute sidebar on desktop", () => {
    expect(panel).toContain("sm:absolute");
    expect(panel).toContain("sm:right-0");
  });

  it("has drag handle for mobile", () => {
    // Drag handle is only rendered on mobile (sm:hidden)
    expect(panel).toContain("sm:hidden");
    // Has a rounded handle bar element
    expect(panel).toContain("rounded-full bg-border");
  });

  it("has backdrop for mobile", () => {
    expect(panel).toContain("bg-black/40");
  });

  it("has close button with aria-label", () => {
    expect(panel).toContain('aria-label="Close"');
  });
});

describe("MapView.tsx — responsive height", () => {
  const mapView = fs.readFileSync(
    path.resolve(__dirname, "../../src/components/MapView.tsx"),
    "utf-8"
  );

  it("uses 7rem total offset on mobile (top + bottom nav)", () => {
    expect(mapView).toContain("calc(100vh-7rem)");
  });

  it("uses 3rem offset on desktop (top nav only)", () => {
    expect(mapView).toContain("calc(100vh-3rem)");
  });

  it("imports useIsMobile hook", () => {
    expect(mapView).toContain("useIsMobile");
  });

  it("sets smaller zoom on mobile", () => {
    // isMobile ? 4 : 5
    expect(mapView).toContain("isMobile ? 4 : 5");
  });
});

describe("DataTable.tsx — mobile column visibility", () => {
  const dataTable = fs.readFileSync(
    path.resolve(__dirname, "../../src/components/DataTable.tsx"),
    "utf-8"
  );

  it("hides Commitment column on mobile", () => {
    expect(dataTable).toContain("hidden");
    // The commitment column header and cell should have sm:table-cell
    expect(dataTable).toContain("sm:table-cell");
  });

  it("hides Operators column until md breakpoint", () => {
    expect(dataTable).toContain("md:table-cell");
  });
});

describe("useDeviceType.ts — exports", () => {
  const hook = fs.readFileSync(
    path.resolve(__dirname, "../../src/lib/useDeviceType.ts"),
    "utf-8"
  );

  it("exports useDeviceType", () => {
    expect(hook).toContain("export function useDeviceType");
  });

  it("exports useIsMobile", () => {
    expect(hook).toContain("export function useIsMobile");
  });

  it("exports DeviceType type with three variants", () => {
    expect(hook).toContain('"mobile"');
    expect(hook).toContain('"tablet"');
    expect(hook).toContain('"desktop"');
  });

  it("cleans up resize listener (returns cleanup fn)", () => {
    expect(hook).toContain("removeEventListener");
  });
});
