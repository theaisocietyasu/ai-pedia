"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";

/* Client-side canvas editor (SSR disabled) */
const FabricEditor = dynamic(() => import("./components/FabricEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] flex items-center justify-center text-gray-400 text-sm">
      Loading studio editor...
    </div>
  ),
});

export default function AnimationStudioPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="min-h-screen bg-white">
          <main className="max-w-6xl mx-auto px-4 py-6">
            <Suspense fallback={null}>
              <FabricEditor />
            </Suspense>
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
