/**
 * Discord Role Verification
 * Checks if a user has the required admin role in the Discord server
 */

const DISCORD_API_BASE = "https://discord.com/api/v10";

interface DiscordGuildMember {
  user?: {
    id: string;
    username: string;
  };
  roles: string[];
}

/**
 * Check if a Discord user has the required admin role
 * @param discordUserId - The Discord user ID
 * @returns Promise<boolean> - Whether the user has the required role
 */
export async function hasRequiredDiscordRole(
  discordUserId: string,
): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const requiredRoleId = process.env.ADMIN_ROLE_ID;

  if (!botToken || !guildId || !requiredRoleId) {
    console.error(
      "Discord role verification is not configured. Missing environment variables.",
    );
    return false;
  }

  try {
    // Fetch guild member information
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
        console.error(
          `User ${discordUserId} is not a member of the guild ${guildId}`,
        );
        return false;
      }
      console.error(
        `Discord API error: ${response.status} ${response.statusText}`,
      );
      return false;
    }

    const member: DiscordGuildMember = await response.json();

    // Check if user has the required role
    const hasRole = member.roles.includes(requiredRoleId);

    if (!hasRole) {
      console.log(
        `User ${discordUserId} does not have the required admin role ${requiredRoleId}`,
      );
    }

    return hasRole;
  } catch (error) {
    console.error("Error checking Discord role:", error);
    return false;
  }
}

/**
 * Get user's Discord roles
 * @param discordUserId - The Discord user ID
 * @returns Promise<string[]> - Array of role IDs
 */
export async function getDiscordUserRoles(
  discordUserId: string,
): Promise<string[]> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!botToken || !guildId) {
    console.error("Discord configuration is missing");
    return [];
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
      return [];
    }

    const member: DiscordGuildMember = await response.json();
    return member.roles || [];
  } catch (error) {
    console.error("Error fetching Discord roles:", error);
    return [];
  }
}
