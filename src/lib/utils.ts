import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(billions: number | null): string {
  if (billions === null) return "N/A";
  if (billions >= 1) return `$${billions}B`;
  return `$${Math.round(billions * 1000)}M`;
}

export function formatMW(mw: number | null): string {
  if (mw === null) return "Unknown";
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)} GW`;
  return `${mw} MW`;
}
