"use client";

import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Returns the current device category based on viewport width.
 * mobile  < 640px  (sm breakpoint)
 * tablet  640–1023px
 * desktop ≥ 1024px (lg breakpoint)
 *
 * Defaults to "desktop" on the server (SSR-safe).
 * Re-evaluates on every resize.
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setDeviceType("mobile");
      else if (w < 1024) setDeviceType("tablet");
      else setDeviceType("desktop");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceType;
}

export function useIsMobile(): boolean {
  return useDeviceType() === "mobile";
}
