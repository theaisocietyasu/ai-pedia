"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth/auth-client";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user is not signed in, redirect to sign-in page
    if (status !== "loading" && !session?.user) {
      const redirectUrl = encodeURIComponent(pathname || "/learn/new");
      router.push(`/auth/signin?redirectTo=${redirectUrl}`);
    }
  }, [session, status, pathname, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-deep border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-ink-2">Checking authentication…</div>
        </div>
      </div>
    );
  }

  // Don't render protected content until we confirm user is authenticated
  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}
