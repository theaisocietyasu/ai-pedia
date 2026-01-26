'use client'

import { SignInButton } from '@/components/auth/auth-components'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'


function SignInPageInner() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <SignInButton redirectTo={redirectTo} />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInPageInner />
    </Suspense>
  );
}
