"use client";

import { Lock, Pencil } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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

  const checkLockStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/learn/content/${modelSlug}/lock`);
      if (response.ok) {
        const data = await response.json();
        setLockStatus(data);
      }
    } catch (error) {
      console.error("Error checking lock status:", error);
    }
  }, [modelSlug]);

  useEffect(() => {
    // Check lock status when hovering
    if (isHovering && !lockStatus) {
      checkLockStatus();
    }
  }, [isHovering, lockStatus, checkLockStatus]);

  const isLocked = lockStatus?.locked === true;

  return (
    <div className="mt-6 relative inline-block">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: hover handlers only detect pointer proximity for a tooltip; the interactive elements are the button/link inside */}
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isLocked ? (
          <button
            type="button"
            disabled
            className="px-6 py-2 bg-surface text-muted rounded-lg border border-line cursor-not-allowed inline-flex items-center gap-2"
          >
            <Lock size={16} aria-hidden="true" />
            <span>Edit This Module</span>
          </button>
        ) : (
          <Link href={`/learn/${category}/${modelSlug}/edit`}>
            <button
              type="button"
              className="px-6 py-2 bg-purple-wash text-purple-deep rounded-lg border border-purple-light hover:bg-purple-wash transition-colors inline-flex items-center gap-2"
            >
              <Pencil size={16} aria-hidden="true" />
              <span>Edit This Module</span>
            </button>
          </Link>
        )}
      </div>

      {/* Tooltip */}
      {isHovering && isLocked && lockStatus?.lockedBy && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-surface border border-purple-light rounded-lg px-4 py-3 shadow-xl max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <Lock
                size={16}
                className="text-purple-light"
                aria-hidden="true"
              />
              <span className="font-semibold text-purple-light">
                Module Locked
              </span>
            </div>
            <p className="text-sm text-ink-2">
              Another officer is making edits
            </p>
            <p className="text-xs text-muted mt-1">
              Currently being edited by:{" "}
              <span className="font-medium text-purple-light">
                {lockStatus.lockedBy}
              </span>
            </p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-purple/40"></div>
          </div>
        </div>
      )}
    </div>
  );
}
