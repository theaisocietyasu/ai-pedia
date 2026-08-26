import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

/** Read a required environment variable, throwing a clear error if missing. */
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: requiredEnv("DISCORD_CLIENT_ID"),
      clientSecret: requiredEnv("DISCORD_CLIENT_SECRET"),
    }),
  ],
  // Use JWT strategy - no database needed!
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // On first sign in, save Discord user ID to token
      if (account && profile) {
        token.discordId = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add Discord ID to session
      if (session.user) {
        session.user.discordId = token.discordId;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      // After sign in or sign out, always redirect to home page
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
