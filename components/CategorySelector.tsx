"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { fetchAllCategories } from "@/lib/api/learn";
import { slugifyCategory } from "@/lib/slug";

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

interface CategorySelectorProps {
  // selected categories are slugs
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  className?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoriesChange,
  className = "",
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await fetchAllCategories();
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryToggle = (categoryName: string) => {
    const slug = slugifyCategory(categoryName);
    const isSelected = selectedCategories.includes(slug);

    if (isSelected) {
      onCategoriesChange(selectedCategories.filter((cat) => cat !== slug));
    } else {
      onCategoriesChange([...selectedCategories, slug]);
    }
  };

  const handleCreateCategory = async () => {
    setCreateError(null);

    // Validate required fields
    if (!newCategoryData.name.trim()) {
      setCreateError("Category name is required");
      return;
    }

    if (!newCategoryData.description.trim()) {
      setCreateError("Category description is required");
      return;
    }

    if (!categoryImage) {
      setCreateError("Category image is required");
      return;
    }

    try {
      setIsCreating(true);

      const formData = new FormData();
      formData.append("name", newCategoryData.name.trim());
      formData.append("description", newCategoryData.description.trim());
      formData.append("image", categoryImage);

      const response = await fetch("/api/learn/categories", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      // Add the new category to the list
      const newCategory: Category = data.category;
      setCategories((prev) => [...prev, newCategory]);

      // Auto-select the newly created category
      const newSlug = slugifyCategory(newCategory.name);
      onCategoriesChange([...selectedCategories, newSlug]);

      // Reset form and close modal
      setNewCategoryData({ name: "", description: "" });
      setCategoryImage(null);
      setImagePreview(null);
      setShowCreateModal(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Error creating category:", err);
      setCreateError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setCreateError(
        "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.",
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setCreateError(
        "File too large. Please upload an image smaller than 5MB.",
      );
      return;
    }

    setCategoryImage(file);
    setCreateError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreateModal = () => {
    setIsOpen(false);
    setShowCreateModal(true);
    setCreateError(null);
    setNewCategoryData({ name: "", description: "" });
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setNewCategoryData({ name: "", description: "" });
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateCategory();
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full p-3 border border-line rounded-lg bg-surface text-muted">
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full p-3 border border-purple-deep/60 rounded-lg bg-surface text-foreground">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label
        htmlFor="category-dropdown"
        className="block text-sm font-medium text-ink-2 mb-2"
      >
        Categories *
      </label>

      {/* Dropdown Button */}
      <button
        id="category-dropdown"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-line rounded-lg bg-surface text-left text-ink-2 hover:border-line focus:outline-none focus:border-purple transition-colors"
      >
        <div className="flex justify-between items-center">
          <span>
            {selectedCategories.length === 0
              ? "Select categories..."
              : `${selectedCategories.length} selected`}
          </span>
          <svg
            aria-hidden="true"
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCategories.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center px-3 py-1 bg-purple-wash text-purple-deep rounded-full text-sm"
            >
              {categories.find((c) => slugifyCategory(c.name) === slug)?.name ||
                slug}
              <button
                type="button"
                onClick={() =>
                  handleCategoryToggle(
                    categories.find((c) => slugifyCategory(c.name) === slug)
                      ?.name || slug,
                  )
                }
                className="ml-2 hover:text-purple-deep"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-surface border border-line rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {categories.map((category) => (
            // biome-ignore lint/a11y/useSemanticElements: a native <button> cannot contain the nested checkbox input
            <div
              key={category._id}
              role="button"
              tabIndex={0}
              className="p-3 hover:bg-surface cursor-pointer border-b border-line"
              onClick={() => handleCategoryToggle(category.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryToggle(category.name);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {category.name}
                  </div>
                  <div className="text-sm text-muted mt-1">
                    {category.description}
                  </div>
                </div>
                <div className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(
                      slugifyCategory(category.name),
                    )}
                    onChange={() => {}} // Handled by parent div click
                    className="w-4 h-4 text-purple bg-surface border-line rounded focus:ring-purple focus:ring-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Create New Category Button */}
          <button
            type="button"
            className="w-full text-left p-3 hover:bg-surface cursor-pointer bg-surface border-t-2 border-purple-light"
            onClick={handleOpenCreateModal}
          >
            <div className="flex items-center gap-2 text-purple-deep">
              <span className="text-xl">+</span>
              <span className="font-medium">Create New Category</span>
            </div>
          </button>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-line rounded-lg max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create New Category
              </h2>
              <p className="text-sm text-muted">
                Add a new category for organizing learning modules.
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-ink-2 mb-2"
                >
                  Category Name *
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple transition-colors"
                  placeholder="e.g., Deep Learning"
                  // biome-ignore lint/a11y/noAutofocus: focusing the first field when the modal opens is expected modal behavior
                  autoFocus
                />
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="category-description"
                  className="block text-sm font-medium text-ink-2 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="category-description"
                  value={newCategoryData.description}
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 placeholder:text-muted focus:outline-none focus:border-purple transition-colors resize-none"
                  placeholder="Brief description of the category..."
                />
              </div>

              {/* Image Upload Field */}
              <div>
                <label
                  htmlFor="category-image"
                  className="block text-sm font-medium text-ink-2 mb-2"
                >
                  Category Image *
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      id="category-image"
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full p-3 border border-line rounded-lg bg-surface text-ink-2 hover:border-line focus:outline-none focus:border-purple transition-colors text-left"
                    >
                      {categoryImage ? categoryImage.name : "Choose image..."}
                    </button>
                  </div>

                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-line">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted mt-2">
                  JPG, PNG, GIF, or WebP. Max 5MB.
                </p>
              </div>

              {/* Error Display */}
              {createError && (
                <div className="p-3 bg-surface border border-purple-deep/60 rounded-lg text-foreground text-sm">
                  {createError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="flex-1 px-4 py-3 bg-surface text-ink-2 rounded-lg hover:bg-surface-2 transition-colors font-medium"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="flex-1 px-4 py-3 bg-foreground text-background rounded-md hover:bg-ink-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    isCreating ||
                    !newCategoryData.name.trim() ||
                    !newCategoryData.description.trim() ||
                    !categoryImage
                  }
                >
                  {isCreating ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
