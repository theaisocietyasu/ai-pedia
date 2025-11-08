'use client'

import { SignInButton } from '@/components/auth/auth-components'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SignInButton redirectTo={redirectTo} />
    </div>
  )
}
