// Guest-safe authentication utility
// Uses device-local UUID instead of Supabase auth for guest mode

import { getDeviceId } from '@/services/localStore';

/**
 * Guest-safe user ID getter.
 * Always returns a valid ID (device UUID for guests).
 * Never throws, never requires authentication.
 */
export function getGuestUserId(): string {
  return getDeviceId();
}

// Re-export getDeviceId for convenience
export { getDeviceId };
