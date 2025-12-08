// Authentication utility for getting the current user ID
// This replaces the device_id approach with proper user authentication

import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the currently authenticated user's ID.
 * Throws an error if no user is authenticated.
 */
export async function getAuthenticatedUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
  
  if (!user) {
    throw new Error("User not authenticated. Please sign in.");
  }
  
  return user.id;
}

/**
 * Gets the current user session.
 * Returns null if no session exists.
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Session error:", error.message);
    return null;
  }
  
  return session;
}

/**
 * Checks if a user is currently authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}
