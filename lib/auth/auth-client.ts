import { useSession as useNextAuthSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

export const useSession = useNextAuthSession

export const signIn = {
  social: async ({ provider, callbackURL }: { provider: string; callbackURL?: string }) => {
    await nextAuthSignIn(provider, { callbackURL })
  }
}

export const signOut = nextAuthSignOut

