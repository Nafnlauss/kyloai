import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Get the current session from NextAuth v5
 * This is a compatibility wrapper that uses the new auth() function
 * 
 * @returns Promise<Session | null> - The current session or null if not authenticated
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Get the current user from the session
 * Convenience function that extracts just the user from the session
 * 
 * @returns Promise<Session["user"] | null> - The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Check if the current user is authenticated
 * 
 * @returns Promise<boolean> - True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session;
}

/**
 * Get the current user ID
 * 
 * @returns Promise<string | null> - The user ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id || null;
}

/**
 * Check if the current user has a specific role
 * 
 * @param role - The role to check for
 * @returns Promise<boolean> - True if the user has the role, false otherwise
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await getServerSession();
  return session?.user?.role === role;
}

/**
 * Check if the current user is an admin
 * 
 * @returns Promise<boolean> - True if the user is an admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("ADMIN");
}

/**
 * Check if the current user is a moderator
 * 
 * @returns Promise<boolean> - True if the user is a moderator, false otherwise
 */
export async function isModerator(): Promise<boolean> {
  return hasRole("MODERATOR");
}