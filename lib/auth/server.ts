import { getServerSession as getNextAuthSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"
import { hasRequiredDiscordRole } from "./discord-roles"

export async function getServerSession() {
  const session = await getNextAuthSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  return session
}

/**
 * Require authentication AND Discord admin role
 * This checks if the user has the required admin role in the Discord server
 */
export async function requireAuthWithRole() {
  const session = await requireAuth()
  
  // Get Discord user ID from the session
  const discordUserId = (session.user as any).discordId
  
  if (!discordUserId) {
    throw new Error("Unable to verify Discord account")
  }
  
  console.log('Checking Discord role for user ID:', discordUserId)
  
  // Check if user has the required role via Discord API
  const hasRole = await hasRequiredDiscordRole(discordUserId)
  
  if (!hasRole) {
    throw new Error("Forbidden - You don't have the required admin role in the Discord server")
  }

  return session
}

