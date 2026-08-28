"use client";

import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Hourglass,
  Lock,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { MarkdownUploadForm } from "@/components/MarkdownUploadForm";
import { VisualizationIndicator } from "@/components/VisualizationIndicator";
import { deleteLearnModule, fetchModuleBySlug } from "@/lib/api/learn";
import { useSession } from "@/lib/auth/auth-client";

interface ModuleInitialData {
  title: string;
  description: string;
  categories: string[];
  actionButtons: { name: string; link: string }[];
  thumbnail: string;
  contributors?: {
    id: string;
    name: string;
    email?: string;
    addedAt?: string;
  }[];
}

interface UpdateResult {
  newSlug?: string;
  slugChanged?: unknown;
  [key: string]: unknown;
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const modelSlug = Array.isArray(params.model)
    ? params.model[0]
    : params.model;
  const { data: session, status } = useSession();

  const [mode, setMode] = useState<"preview" | "edit">("edit");
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<ModuleInitialData | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [lockError, setLockError] = useState<string | null>(null);
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const [hasLock, setHasLock] = useState(false);
  const [heartbeatInterval, setHeartbeatInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Acquire lock and load existing module data
  // biome-ignore lint/correctness/useExhaustiveDependencies: adding hasLock/heartbeatInterval/params would re-run lock acquisition and break the heartbeat lifecycle; must only run when the module or session changes
  useEffect(() => {
    // Don't make API calls until we know the user is authenticated
    if (status === "loading" || !session?.user) {
      redirect(
        `/auth/signin?redirectTo=/learn/${params.category}/${modelSlug}/edit`,
      );
      return;
    }

    const acquireLockAndLoadModule = async () => {
      if (!modelSlug) return;

      try {
        setLoading(true);

        // First, try to acquire the lock
        const lockResponse = await fetch(
          `/api/learn/content/${modelSlug}/lock`,
          {
            method: "POST",
          },
        );

        const lockData = await lockResponse.json();

        if (!lockResponse.ok) {
          if (lockResponse.status === 423) {
            // Locked by another user
            setLockedBy(lockData.lockedBy || "Another officer");
            setLockError(
              `This module is currently being edited by ${lockData.lockedBy || "another officer"}. Please try again later.`,
            );
            setLoading(false);
            return;
          }
          throw new Error("Failed to acquire edit lock");
        }

        // Lock acquired successfully
        setHasLock(true);
        setLockError(null);

        // Load the module data
        const module = await fetchModuleBySlug(modelSlug);

        // Set markdown content
        setMarkdown(module.content || "");

        // Prepare initial data for the form
        setInitialData({
          title: module.title,
          description: module.description,
          categories: module.categories || [],
          actionButtons: module.action_buttions || [],
          thumbnail: module.thumbnail,
          contributors: module.contributors || [],
        });

        // Set up heartbeat to keep lock alive
        const interval = setInterval(async () => {
          try {
            const heartbeatResponse = await fetch(
              `/api/learn/content/${modelSlug}/lock`,
              {
                method: "PATCH",
              },
            );

            if (!heartbeatResponse.ok) {
              console.error("Heartbeat failed - lock may have expired");
              clearInterval(interval);
              setHasLock(false);
              setLockError(
                "Your edit session has expired. Please refresh the page to continue editing.",
              );
            }
          } catch (err) {
            console.error("Error sending heartbeat:", err);
          }
        }, lockData.heartbeatInterval || 30000);

        setHeartbeatInterval(interval);

        setError(null);
      } catch (err) {
        console.error("Error loading module:", err);
        setError("Failed to load module. Please check if the module exists.");
      } finally {
        setLoading(false);
      }
    };

    acquireLockAndLoadModule();

    // Cleanup: release lock on unmount
    return () => {
      if (modelSlug && hasLock) {
        fetch(`/api/learn/content/${modelSlug}/lock`, {
          method: "DELETE",
        }).catch((err) => console.error("Error releasing lock:", err));
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [modelSlug, session, status]);

  const handleUpdateSuccess = async (result: UpdateResult) => {
    setUpdateSuccess(result.newSlug ?? null);

    // Release the lock
    if (modelSlug && hasLock) {
      try {
        await fetch(`/api/learn/content/${modelSlug}/lock`, {
          method: "DELETE",
        });
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
        }
      } catch (err) {
        console.error("Error releasing lock after update:", err);
      }
    }

    // Show success message for a few seconds, then redirect
    setTimeout(() => {
      if (result.slugChanged) {
        // Redirect to the new URL if slug changed
        const firstCategory = initialData?.categories[0] || params.category;
        router.push(`/learn/${firstCategory}/${result.newSlug}`);
      } else {
        // Redirect back to view page
        router.push(`/learn/${params.category}/${modelSlug}`);
      }
    }, 2000);
  };

  const handleDelete = async () => {
    if (!modelSlug) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteLearnModule(modelSlug);

      // Redirect to category page after successful deletion
      setTimeout(() => {
        router.push(`/learn/${params.category}`);
      }, 1500);
    } catch (err) {
      console.error("Error deleting module:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete module",
      );
      setIsDeleting(false);
    }
  };

  // Show loading while checking auth status
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Hourglass
              size={48}
              className="text-purple/60"
              aria-hidden="true"
            />
          </div>
          <div className="text-xl text-muted">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Hourglass
              size={48}
              className="text-purple/60"
              aria-hidden="true"
            />
          </div>
          <div className="text-xl text-muted">Loading module data...</div>
        </div>
      </div>
    );
  }

  if (lockError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <Lock size={48} className="text-purple-light" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-purple-light mb-4">
            Module is Locked
          </h2>
          <div className="text-lg text-ink-2 mb-2">{lockError}</div>
          {lockedBy && (
            <div className="text-sm text-muted mb-6">
              Currently being edited by:{" "}
              <span className="font-semibold text-purple-light">
                {lockedBy}
              </span>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() =>
                router.push(`/learn/${params.category}/${modelSlug}`)
              }
              className="px-6 py-3 bg-foreground text-background rounded-md hover:bg-ink-2 transition-colors"
            >
              View Module
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-surface text-foreground rounded-lg hover:bg-surface-2 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <AlertCircle
              size={48}
              className="text-purple-light"
              aria-hidden="true"
            />
          </div>
          <div className="text-xl text-foreground mb-4">{error}</div>
          <button
            type="button"
            onClick={() => router.push(`/learn/${params.category}`)}
            className="px-6 py-3 bg-foreground text-background rounded-md hover:bg-ink-2 transition-colors"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard>
        <div className="bg-background">
          {/* Header/Navbar */}
          <div className="border-b border-line bg-surface">
            <header className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center w-full">
                {/* Logo or Title */}
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mr-8">
                  Edit Learning Module
                </h1>
                {/* Mode Toggle */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex bg-surface rounded-lg p-1 border border-line">
                    <button
                      type="button"
                      onClick={() => setMode("preview")}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        mode === "preview"
                          ? "bg-foreground text-background"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <Eye
                        size={16}
                        className="inline-block mr-1.5 align-text-bottom"
                        aria-hidden="true"
                      />
                      Preview Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("edit")}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        mode === "edit"
                          ? "bg-foreground text-background"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <Pencil
                        size={16}
                        className="inline-block mr-1.5 align-text-bottom"
                        aria-hidden="true"
                      />
                      Edit Mode
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-sm bg-foreground hover:bg-ink-2 text-background rounded-md transition-colors inline-flex items-center gap-1.5"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    Delete Module
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/learn/${params.category}/${modelSlug}`)
                    }
                    className="px-4 py-2 text-sm bg-surface text-ink-2 rounded-md hover:bg-surface-2 transition-colors"
                  >
                    ← Cancel & Go Back
                  </button>
                </div>
              </div>
            </header>
            <p className="text-muted mt-1 px-6 pb-4">
              {mode === "preview"
                ? "Edit markdown on the left and see the live preview on the right"
                : "Update the module details and content"}
            </p>
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="flex items-center gap-2 bg-purple-wash border border-purple-light text-purple-light px-6 py-4">
              <CheckCircle2 size={16} aria-hidden="true" />
              Learning module updated successfully! Redirecting...
            </div>
          )}

          {/* Delete Error Message */}
          {deleteError && (
            <div className="flex items-center gap-2 bg-surface border border-purple-deep/60 text-foreground px-6 py-4">
              <AlertCircle
                size={16}
                className="text-purple-light"
                aria-hidden="true"
              />
              {deleteError}
            </div>
          )}

          {/* Deleting Message */}
          {isDeleting && (
            <div className="flex items-center gap-2 bg-purple-wash border border-purple-light text-purple-light px-6 py-4">
              <Trash2 size={16} aria-hidden="true" />
              Deleting module... Please wait.
            </div>
          )}

          {/* Editor Layout */}
          <div className="flex">
            {mode === "preview" ? (
              <>
                {/* Editor Panel */}
                <div className="w-1/2 border-r border-line bg-surface split-separator">
                  <div className="h-full flex flex-col">
                    {/* Editor Header */}
                    <div className="border-b border-line px-4 py-2 bg-background">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                          <FileText size={14} aria-hidden="true" />
                          Markdown Editor
                        </h2>
                        <div className="flex items-center space-x-4 text-xs text-muted">
                          <span>Lines: {markdown.split("\n").length}</span>
                          <span>
                            Words:{" "}
                            {
                              markdown
                                .split(/\s+/)
                                .filter((word) => word.length > 0).length
                            }
                          </span>
                          <span>Chars: {markdown.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="border-b border-line px-4 py-3 bg-background/50">
                      <ImageUploadButton />
                    </div>

                    {/* Text Editor */}
                    <div className="flex-1 relative editor-container">
                      <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="editor-textarea w-full h-full p-4 text-sm"
                        placeholder={`Type your markdown here...

Try these examples:
# Heading
**bold text**
*italic text*
\`inline code\`

\`\`\`python
print('code block')
\`\`\`

$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$

<div id="VZ-example" data-placeholder="Your Interactive Viz"></div>`}
                        spellCheck={false}
                      />

                      {/* Editor Guidelines Overlay */}
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs text-muted max-w-xs opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                        <div className="font-medium mb-2 text-purple-light flex items-center gap-1.5">
                          <Sparkles size={14} aria-hidden="true" />
                          Quick Reference
                        </div>
                        <div className="space-y-1 font-mono">
                          <div># Heading 1</div>
                          <div>## Heading 2</div>
                          <div>**bold** *italic*</div>
                          <div>`inline code`</div>
                          <div>```python</div>
                          <div>code block</div>
                          <div>```</div>
                          <div>$$math equation$$</div>
                          <div className="text-purple-deep mt-2 mb-1 font-normal flex items-center gap-1.5">
                            <BarChart3 size={14} aria-hidden="true" />
                            Visualizations:
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-linear-equation"&gt;&lt;/div&gt;
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-assumptions-plots"&gt;&lt;/div&gt;
                          </div>
                          <div className="text-purple-deep text-[10px]">
                            &lt;div id="VZ-model-evaluation"&gt;&lt;/div&gt;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="w-1/2 bg-background">
                  <div className="h-full flex flex-col">
                    {/* Preview Header */}
                    <div className="border-b border-line px-4 py-2 bg-surface">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                            <Eye size={14} aria-hidden="true" />
                            Live Preview
                          </h2>
                          <VisualizationIndicator content={markdown} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setMarkdown("")}
                          className="px-3 py-1 text-xs bg-surface text-ink-2 rounded border border-line hover:bg-surface-2 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Trash2 size={12} aria-hidden="true" />
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto preview-container">
                      {markdown.trim() ? (
                        <MarkdownRenderer content={markdown} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted">
                          <div className="text-center max-w-md">
                            <div className="mb-4 flex justify-center">
                              <FileText
                                size={48}
                                className="text-purple/60"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="text-lg mb-2 text-muted">
                              No content to preview
                            </div>
                            <div className="text-sm text-muted leading-relaxed">
                              Start typing markdown in the editor to see the
                              live preview.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Edit Mode */
              <div className="w-full bg-background">
                <div className="h-full flex">
                  {/* Edit Form Panel */}
                  <div className="w-1/2 border-r border-line overflow-y-auto">
                    <div className="p-6">
                      <MarkdownUploadForm
                        mode="edit"
                        moduleSlug={modelSlug}
                        markdownContent={markdown}
                        initialData={initialData ?? undefined}
                        onUploadSuccess={() => {}} // Not used in edit mode
                        onUpdateSuccess={handleUpdateSuccess}
                      />
                    </div>
                  </div>

                  {/* Content Preview Panel */}
                  <div className="w-1/2 bg-background">
                    <div className="h-full flex flex-col">
                      {/* Preview Header */}
                      <div className="border-b border-line px-4 py-2 bg-surface">
                        <div className="flex items-center gap-4">
                          <h2 className="text-sm font-medium text-ink-2 flex items-center gap-1.5">
                            <Eye size={14} aria-hidden="true" />
                            Content Preview
                          </h2>
                          <VisualizationIndicator content={markdown} />
                        </div>
                      </div>

                      {/* Preview Content */}
                      <div className="flex-1 overflow-y-auto preview-container">
                        {markdown.trim() ? (
                          <MarkdownRenderer content={markdown} />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted">
                            <div className="text-center max-w-md">
                              <div className="mb-4 flex justify-center">
                                <BookOpen
                                  size={48}
                                  className="text-purple/60"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="text-lg mb-2 text-muted">
                                No content available
                              </div>
                              <div className="text-sm text-muted leading-relaxed">
                                The module content is empty. Switch to Preview
                                Mode to edit the markdown content.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4">
              <div className="bg-surface border border-line rounded-lg max-w-md w-full p-6">
                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">
                    <AlertTriangle
                      size={48}
                      className="text-purple-light"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-light mb-2">
                    Delete Learning Module?
                  </h2>
                  <p className="text-ink-2 mb-1">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-foreground">
                      {initialData?.title}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-muted">
                    This action cannot be undone. All content will be
                    permanently deleted.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-3 bg-surface text-ink-2 rounded-lg hover:bg-surface-2 transition-colors font-medium"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      handleDelete();
                    }}
                    className="flex-1 px-4 py-3 bg-foreground hover:bg-ink-2 text-background rounded-lg transition-colors font-medium"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
