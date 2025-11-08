import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
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
        token.discordId = (profile as any).id
      }
      return token
    },
    async session({ session, token }) {
      // Add Discord ID to session
      if (session.user) {
        (session.user as any).discordId = token.discordId
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After sign in or sign out, always redirect to home page
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
