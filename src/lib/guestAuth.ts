// Guest-safe authentication utility
// Uses device-local UUID instead of Supabase auth for guest mode

/**
 * Gets the device UUID for guest mode.
 * This is the primary identifier for guest users.
 */
export function getDeviceId(): string {
  const stored = localStorage.getItem('naja_device_id');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('naja_device_id', newId);
  return newId;
}

/**
 * Guest-safe user ID getter.
 * Always returns a valid ID (device UUID for guests).
 * Never throws, never requires authentication.
 */
export function getGuestUserId(): string {
  return getDeviceId();
}
