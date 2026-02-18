/**
 * Haptic feedback utility — wraps navigator.vibrate() for web
 * and falls back gracefully if not supported.
 */

function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail — haptics are best-effort
  }
}

/** Light tap — single bead increment, sunnah toggle */
export function hapticLight(): void {
  vibrate(10);
}

/** Medium tap — prayer completion */
export function hapticMedium(): void {
  vibrate(25);
}

/** Success pattern — target reached, level up */
export function hapticSuccess(): void {
  vibrate([30, 50, 30]);
}
