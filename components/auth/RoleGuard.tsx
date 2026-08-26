"use client";

import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side role verification component
 * Checks if the authenticated user has the required Discord admin role
 */
export function RoleGuard({ children, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (status === "loading" || !session?.user) {
        setHasRole(false);
        return;
      }

      try {
        // Call API to verify role
        const response = await fetch("/api/auth/verify-role");
        const data = await response.json();

        if (data.hasRole) {
          setHasRole(true);
        } else {
          setHasRole(false);
          setError(data.error || "You don't have the required admin role");
        }
      } catch (err) {
        console.error("Error checking role:", err);
        setHasRole(false);
        setError("Failed to verify Discord role");
      }
    }

    checkRole();
  }, [session, status]);

  // Loading state
  if (hasRole === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="max-w-md w-full bg-dark-gray/50 backdrop-blur-sm border border-purple/20 rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-light-gray">Verifying Discord role...</p>
        </div>
      </div>
    );
  }

  // No role - show error
  if (!hasRole) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-dark-gray/50 backdrop-blur-sm border border-purple-deep/60 rounded-2xl p-8 text-center">
            <div className="mb-4 flex justify-center">
              <Ban size={48} className="text-purple-light" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-purple-light">
              Access Denied
            </h2>
            <p className="text-light-gray mb-6">
              {error ||
                "You must have the admin role in the Discord server to access this feature."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-purple/20 hover:bg-purple/30 text-purple-300 rounded-lg border border-purple/30 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      )
    );
  }

  // Has role - show content
  return <>{children}</>;
}
