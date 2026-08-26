import { NextResponse } from "next/server";
import { getServerSession as getNextAuthSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { hasRequiredDiscordRole } from "./discord-roles";

/**
 * Thrown by the require* helpers so API routes can map auth failures
 * to proper 401/403 responses (see authErrorResponse).
 */
export class AuthError extends Error {
  status: 401 | 403;

  constructor(message: string, status: 401 | 403) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * Convert a caught error into a 401/403 JSON response, or null if it
 * isn't an auth failure. Use at the top of API route catch blocks.
 */
export function authErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  return null;
}

export async function getServerSession() {
  const session = await getNextAuthSession(authOptions);
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    throw new AuthError("Unauthorized", 401);
  }

  return session;
}

/**
 * Require authentication AND the admin role in the Discord server.
 */
export async function requireAuthWithRole() {
  const session = await requireAuth();

  const discordUserId = session.user.discordId;

  if (!discordUserId) {
    throw new AuthError("Unable to verify Discord account", 401);
  }

  const hasRole = await hasRequiredDiscordRole(discordUserId);

  if (!hasRole) {
    throw new AuthError(
      "Forbidden - You don't have the required admin role in the Discord server",
      403,
    );
  }

  return session;
}
