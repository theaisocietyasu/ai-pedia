/**
 * Discord Role Verification
 * Checks if a user has the required admin role in the Discord server.
 *
 * Results are cached in-memory per user for a few minutes so that a burst of
 * admin actions (editor heartbeats, saves, uploads) doesn't hit the Discord
 * API on every request. Role changes in Discord take up to the TTL to
 * propagate here.
 */

const DISCORD_API_BASE = "https://discord.com/api/v10";
const ROLE_CACHE_TTL_MS = 5 * 60 * 1000;

interface DiscordGuildMember {
  user?: {
    id: string;
    username: string;
  };
  roles: string[];
}

const roleCache = new Map<string, { roles: string[]; expiresAt: number }>();

/**
 * Fetch a guild member's role IDs, with caching.
 * Returns [] for users who are not guild members (a definitive, cacheable
 * answer) and null on transient errors (not cached).
 */
async function fetchGuildMemberRoles(
  discordUserId: string,
): Promise<string[] | null> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!botToken || !guildId) {
    console.error("Discord role verification is not configured. Missing environment variables.");
    return null;
  }

  const cached = roleCache.get(discordUserId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.roles;
  }

  try {
    const response = await fetch(
      `${DISCORD_API_BASE}/guilds/${guildId}/members/${discordUserId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Not a guild member — definitive, cache as no roles
        roleCache.set(discordUserId, {
          roles: [],
          expiresAt: Date.now() + ROLE_CACHE_TTL_MS,
        });
        return [];
      }
      console.error(`Discord API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const member: DiscordGuildMember = await response.json();
    const roles = member.roles || [];
    roleCache.set(discordUserId, {
      roles,
      expiresAt: Date.now() + ROLE_CACHE_TTL_MS,
    });
    return roles;
  } catch (error) {
    console.error("Error fetching Discord roles:", error);
    return null;
  }
}

/**
 * Check if a Discord user has the required admin role
 */
export async function hasRequiredDiscordRole(
  discordUserId: string,
): Promise<boolean> {
  const requiredRoleId = process.env.ADMIN_ROLE_ID;

  if (!requiredRoleId) {
    console.error("Discord role verification is not configured. Missing ADMIN_ROLE_ID.");
    return false;
  }

  const roles = await fetchGuildMemberRoles(discordUserId);
  return roles !== null && roles.includes(requiredRoleId);
}

/**
 * Get user's Discord role IDs (empty array if unavailable)
 */
export async function getDiscordUserRoles(
  discordUserId: string,
): Promise<string[]> {
  const roles = await fetchGuildMemberRoles(discordUserId);
  return roles ?? [];
}
