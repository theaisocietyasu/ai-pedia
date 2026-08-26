"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface EditButtonProps {
  category: string;
  modelSlug: string;
}

export function EditButton({ category, modelSlug }: EditButtonProps) {
  const [lockStatus, setLockStatus] = useState<{
    locked: boolean;
    lockedBy?: string;
  } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check lock status when hovering
    if (isHovering && !lockStatus) {
      checkLockStatus();
    }
  }, [isHovering]);

  const checkLockStatus = async () => {
    try {
      const response = await fetch(`/api/learn/content/${modelSlug}/lock`);
      if (response.ok) {
        const data = await response.json();
        setLockStatus(data);
      }
    } catch (error) {
      console.error("Error checking lock status:", error);
    }
  };

  const isLocked = lockStatus?.locked === true;

  return (
    <div className="mt-6 relative inline-block">
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isLocked ? (
          <button
            disabled
            className="px-6 py-2 bg-gray-800/50 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed inline-flex items-center gap-2"
          >
            <span>🔒</span>
            <span>Edit This Module</span>
          </button>
        ) : (
          <Link href={`/learn/${category}/${modelSlug}/edit`}>
            <button className="px-6 py-2 bg-purple/20 text-purple-300 rounded-lg border border-purple/30 hover:bg-purple/30 transition-colors inline-flex items-center gap-2">
              <span>✏️</span>
              <span>Edit This Module</span>
            </button>
          </Link>
        )}
      </div>

      {/* Tooltip */}
      {isHovering && isLocked && lockStatus?.lockedBy && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-gray-900 border border-yellow-500/50 rounded-lg px-4 py-3 shadow-xl max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">🔒</span>
              <span className="font-semibold text-yellow-400">
                Module Locked
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Another officer is making edits
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Currently being edited by:{" "}
              <span className="font-medium text-yellow-300">
                {lockStatus.lockedBy}
              </span>
            </p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-500/50"></div>
          </div>
        </div>
      )}
    </div>
  );
}
