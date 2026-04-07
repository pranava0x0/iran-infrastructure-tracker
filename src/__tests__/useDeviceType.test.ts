import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeviceType, useIsMobile } from "@/lib/useDeviceType";

// jsdom defaults to innerWidth=0; we mock it per test
function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

describe("useDeviceType", () => {
  beforeEach(() => {
    // Start at desktop width so SSR default matches
    setViewportWidth(1280);
  });

  it("returns 'mobile' for width < 640", () => {
    setViewportWidth(375);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("mobile");
  });

  it("returns 'tablet' for 640 ≤ width < 1024", () => {
    setViewportWidth(768);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("tablet");
  });

  it("returns 'desktop' for width ≥ 1024", () => {
    setViewportWidth(1440);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");
  });

  it("returns 'tablet' at exactly 640px boundary", () => {
    setViewportWidth(640);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("tablet");
  });

  it("returns 'desktop' at exactly 1024px boundary", () => {
    setViewportWidth(1024);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");
  });

  it("updates on resize", () => {
    setViewportWidth(1440);
    const { result } = renderHook(() => useDeviceType());
    expect(result.current).toBe("desktop");

    act(() => {
      setViewportWidth(375);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe("mobile");
  });

  it("cleans up resize listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useDeviceType());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});

describe("useIsMobile", () => {
  it("returns true for mobile width", () => {
    setViewportWidth(375);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false for desktop width", () => {
    setViewportWidth(1280);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
