/**
 * Should this device get live 3D at all? Respects reduced motion and data saver,
 * skips low-memory / low-core devices, and requires WebGL2.
 */
export function canUse3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency < 4) return false;
  try {
    if (!document.createElement("canvas").getContext("webgl2")) return false;
  } catch {
    return false;
  }
  return true;
}

/**
 * Laptops/desktops load 3D automatically. On phones and tablets it's opt-in:
 * measured on a mid-range phone profile, starting 3D blocked the page for ~2 s.
 */
export function isDesktopPointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 1024;
}
