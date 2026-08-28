"use client";

import { BookOpen, Pencil, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { invalidateModulesCache } from "@/app/learn/categories";
import { Button } from "@/components/ui/button";
import { updateLearnModule, uploadLearnModule } from "@/lib/api/learn";
import { CategorySelector } from "./CategorySelector";

interface ActionButton {
  name: string;
  link: string;
}

interface InitialData {
  title: string;
  description: string;
  categories: string[];
  actionButtons: ActionButton[];
  thumbnail: string;
  contributors?: Array<{
    id: string;
    name: string;
    email?: string;
    addedAt?: string;
  }>;
}

interface UpdateLearnModuleResult {
  newSlug?: string;
  [key: string]: unknown;
}

interface MarkdownUploadFormProps {
  markdownContent: string;
  onUploadSuccess: (moduleId: string) => void;
  className?: string;
  mode?: "create" | "edit";
  moduleSlug?: string;
  initialData?: InitialData;
  onUpdateSuccess?: (result: UpdateLearnModuleResult) => void;
}

export const MarkdownUploadForm: React.FC<MarkdownUploadFormProps> = ({
  markdownContent,
  onUploadSuccess,
  className = "",
  mode = "create",
  moduleSlug,
  initialData,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    actionButtons: [] as ActionButton[],
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<
    string | null
  >(null);
  const [keepExistingThumbnail, setKeepExistingThumbnail] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newActionButton, setNewActionButton] = useState({
    name: "",
    link: "",
  });

  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        categories: initialData.categories,
        actionButtons: initialData.actionButtons,
      });
      setExistingThumbnailUrl(initialData.thumbnail);
      setKeepExistingThumbnail(true);
    }
  }, [mode, initialData]);

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThumbnailSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.",
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Please upload an image smaller than 5MB.");
      return;
    }

    setThumbnail(file);
    setKeepExistingThumbnail(false);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResetThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    setKeepExistingThumbnail(true);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const addActionButton = () => {
    if (newActionButton.name.trim() && newActionButton.link.trim()) {
      setFormData((prev) => ({
        ...prev,
        actionButtons: [...prev.actionButtons, { ...newActionButton }],
      }));
      setNewActionButton({ name: "", link: "" });
    }
  };

  const removeActionButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actionButtons: prev.actionButtons.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (formData.categories.length === 0) {
      setError("At least one category is required");
      return false;
    }
    // In create mode, thumbnail is required. In edit mode, either keep existing or upload new
    if (mode === "create" && !thumbnail) {
      setError("Thumbnail image is required");
      return false;
    }
    if (mode === "edit" && !keepExistingThumbnail && !thumbnail) {
      setError("Please select a new thumbnail or keep the existing one");
      return false;
    }
    if (!markdownContent.trim()) {
      setError("Markdown content is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setIsUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("content", markdownContent);
      formDataToSend.append("categories", JSON.stringify(formData.categories));
      formDataToSend.append(
        "action_buttons",
        JSON.stringify(formData.actionButtons),
      );

      if (mode === "create") {
        // Create mode: thumbnail is required
        // biome-ignore lint/style/noNonNullAssertion: validateForm() guarantees thumbnail is set in create mode
        formDataToSend.append("thumbnail", thumbnail!);

        const result = await uploadLearnModule(formDataToSend);

        // Invalidate caches for selected categories (slugs)
        for (const slug of formData.categories) {
          invalidateModulesCache(slug);
        }

        // Clear form on success
        setFormData({
          title: "",
          description: "",
          categories: [],
          actionButtons: [],
        });
        setThumbnail(null);
        setThumbnailPreview(null);

        onUploadSuccess(result.id);
      } else {
        // Edit mode
        if (keepExistingThumbnail) {
          formDataToSend.append("keep_existing_thumbnail", "true");
        } else if (thumbnail) {
          formDataToSend.append("thumbnail", thumbnail);
        }

        // biome-ignore lint/style/noNonNullAssertion: moduleSlug is always provided by the caller in edit mode
        const result = await updateLearnModule(moduleSlug!, formDataToSend);

        // Invalidate caches for all categories (old and new)
        if (initialData) {
          for (const slug of initialData.categories) {
            invalidateModulesCache(slug);
          }
        }
        for (const slug of formData.categories) {
          invalidateModulesCache(slug);
        }

        // Call update success callback
        if (onUpdateSuccess) {
          onUpdateSuccess(result);
        }
      }
    } catch (err) {
      console.error(`${mode === "create" ? "Upload" : "Update"} error:`, err);
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${mode === "create" ? "upload" : "update"} learn module`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`bg-surface border border-line rounded-lg p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        {mode === "create" ? (
          <>
            <BookOpen size={18} aria-hidden="true" />
            Upload Learning Module
          </>
        ) : (
          <>
            <Pencil size={18} aria-hidden="true" />
            Edit Learning Module
          </>
        )}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="module-title"
            className="block text-sm font-medium text-ink-2 mb-2"
          >
            Title *
          </label>
          <input
            id="module-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple transition-colors"
            placeholder="Enter module title..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="module-description"
            className="block text-sm font-medium text-ink-2 mb-2"
          >
            Description *
          </label>
          <textarea
            id="module-description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple transition-colors resize-none"
            placeholder="Brief description of the learning module..."
            required
          />
        </div>

        {/* Categories */}
        <CategorySelector
          selectedCategories={formData.categories}
          onCategoriesChange={(categories) =>
            handleInputChange("categories", categories)
          }
        />

        {/* Thumbnail Upload */}
        <div>
          <label
            htmlFor="module-thumbnail"
            className="block text-sm font-medium text-ink-2 mb-2"
          >
            Thumbnail Image *
          </label>

          {/* Show existing thumbnail in edit mode */}
          {mode === "edit" &&
            existingThumbnailUrl &&
            keepExistingThumbnail &&
            !thumbnail && (
              <div className="mb-3 p-3 bg-surface rounded-lg border border-line">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-line">
                    <img
                      src={existingThumbnailUrl}
                      alt="Current thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-ink-2 mb-2">Current Thumbnail</p>
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="text-sm text-purple-deep hover:text-purple-deep underline"
                    >
                      Replace with new image
                    </button>
                  </div>
                </div>
              </div>
            )}

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                id="module-thumbnail"
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 hover:border-line focus:outline-none focus:border-purple transition-colors text-left"
              >
                {thumbnail
                  ? thumbnail.name
                  : mode === "edit" && keepExistingThumbnail
                    ? "Keep current thumbnail"
                    : "Choose thumbnail image..."}
              </button>
            </div>

            {thumbnailPreview && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-line">
                  <img
                    src={thumbnailPreview}
                    alt="New thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={handleResetThumbnail}
                    aria-label="Remove thumbnail"
                    className="text-purple-light hover:text-purple text-sm"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Contributors, Shows in edit mode */}
        {mode === "edit" &&
          initialData?.contributors &&
          initialData.contributors.length > 0 && (
            <div>
              <span className="block text-sm font-medium text-ink-2 mb-2">
                Contributors
              </span>
              <div className="p-3 bg-surface border border-line rounded-lg space-y-2">
                {initialData.contributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-wash border border-purple-light flex items-center justify-center text-purple-deep font-medium">
                      {contributor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-ink-2 font-medium">
                        {contributor.name}
                      </div>
                      {contributor.email && (
                        <div className="text-muted text-xs">
                          {contributor.email}
                        </div>
                      )}
                    </div>
                    {contributor.addedAt && (
                      <div className="text-muted/70 text-xs">
                        {new Date(contributor.addedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                Contributors are automatically added when someone edits this
                module.
              </p>
            </div>
          )}

        {/* Action Buttons */}
        <div>
          <span className="block text-sm font-medium text-ink-2 mb-2">
            Action Buttons (Optional)
          </span>

          {/* Existing Action Buttons */}
          {formData.actionButtons.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.actionButtons.map((button, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: action buttons have no stable unique id and name/link pairs may repeat
                  key={index}
                  className="flex items-center gap-2 p-2 bg-surface rounded border border-line"
                >
                  <span className="flex-1 text-sm text-ink-2">
                    <strong>{button.name}</strong> → {button.link}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActionButton(index)}
                    className="text-purple-light hover:text-purple text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Action Button */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Button name"
              value={newActionButton.name}
              onChange={(e) =>
                setNewActionButton((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="flex-1 p-2 border border-line rounded bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple text-sm"
            />
            <input
              type="url"
              placeholder="Button link"
              value={newActionButton.link}
              onChange={(e) =>
                setNewActionButton((prev) => ({
                  ...prev,
                  link: e.target.value,
                }))
              }
              className="flex-1 p-2 border border-line rounded bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple text-sm"
            />
            <button
              type="button"
              onClick={addActionButton}
              disabled={
                !newActionButton.name.trim() || !newActionButton.link.trim()
              }
              className="px-3 py-2 bg-purple-wash text-purple-deep rounded border border-purple-light hover:bg-purple-wash transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div>
          <span className="block text-sm font-medium text-ink-2 mb-2">
            Content Preview
          </span>
          <div className="p-3 bg-surface border border-line rounded-lg text-sm text-muted">
            {markdownContent.trim() ? (
              <div>
                <div>Characters: {markdownContent.length}</div>
                <div>
                  Words:{" "}
                  {
                    markdownContent
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                </div>
                <div>Lines: {markdownContent.split("\n").length}</div>
              </div>
            ) : (
              "No content in editor"
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-surface border border-purple-deep/60 rounded-lg text-foreground text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUploading}
          className="w-full"
          variant="primary"
        >
          {isUploading
            ? mode === "create"
              ? "Uploading..."
              : "Updating..."
            : mode === "create"
              ? "Upload Learning Module"
              : "Update Learning Module"}
        </Button>
      </form>
    </div>
  );
};
