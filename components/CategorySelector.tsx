'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchAllCategories } from '@/lib/api';
import { slugifyCategory } from '@/lib/slug';

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
  className = ''
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: ''
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
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryToggle = (categoryName: string) => {
    const slug = slugifyCategory(categoryName);
    const isSelected = selectedCategories.includes(slug);

    if (isSelected) {
      onCategoriesChange(selectedCategories.filter(cat => cat !== slug));
    } else {
      onCategoriesChange([...selectedCategories, slug]);
    }
  };

  const handleCreateCategory = async () => {
    setCreateError(null);

    // Validate required fields
    if (!newCategoryData.name.trim()) {
      setCreateError('Category name is required');
      return;
    }

    if (!newCategoryData.description.trim()) {
      setCreateError('Category description is required');
      return;
    }

    if (!categoryImage) {
      setCreateError('Category image is required');
      return;
    }

    try {
      setIsCreating(true);

      const formData = new FormData();
      formData.append('name', newCategoryData.name.trim());
      formData.append('description', newCategoryData.description.trim());
      formData.append('image', categoryImage);

      const response = await fetch('/api/learn/categories', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      // Add the new category to the list
      const newCategory: Category = data.category;
      setCategories(prev => [...prev, newCategory]);

      // Auto-select the newly created category
      const newSlug = slugifyCategory(newCategory.name);
      onCategoriesChange([...selectedCategories, newSlug]);

      // Reset form and close modal
      setNewCategoryData({ name: '', description: '' });
      setCategoryImage(null);
      setImagePreview(null);
      setShowCreateModal(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating category:', err);
      setCreateError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setCreateError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setCreateError('File too large. Please upload an image smaller than 5MB.');
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
    setNewCategoryData({ name: '', description: '' });
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setNewCategoryData({ name: '', description: '' });
    setCategoryImage(null);
    setImagePreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreateCategory();
    }
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400">
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full p-3 border border-red-500 rounded-lg bg-red-900/20 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Categories *
      </label>
      
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-left text-gray-300 hover:border-gray-500 focus:outline-none focus:border-purple transition-colors"
      >
        <div className="flex justify-between items-center">
          <span>
            {selectedCategories.length === 0
              ? 'Select categories...'
              : `${selectedCategories.length} selected`}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCategories.map(slug => (
            <span
              key={slug}
              className="inline-flex items-center px-3 py-1 bg-purple/20 text-purple-300 rounded-full text-sm"
            >
              {categories.find(c => slugifyCategory(c.name) === slug)?.name || slug}
              <button
                type="button"
                onClick={() => handleCategoryToggle(categories.find(c => slugifyCategory(c.name) === slug)?.name || slug)}
                className="ml-2 hover:text-purple-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {categories.map(category => (
            <div
              key={category._id}
              className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
              onClick={() => handleCategoryToggle(category.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-200">{category.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{category.description}</div>
                </div>
                <div className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(slugifyCategory(category.name))}
                    onChange={() => {}} // Handled by parent div click
                    className="w-4 h-4 text-purple bg-gray-700 border-gray-600 rounded focus:ring-purple focus:ring-2"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Create New Category Button */}
          <div
            className="p-3 hover:bg-gray-700 cursor-pointer bg-gray-800/80 border-t-2 border-purple/30"
            onClick={handleOpenCreateModal}
          >
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-xl">+</span>
              <span className="font-medium">Create New Category</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-gray border border-gray-700 rounded-lg max-w-md w-full p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">Create New Category</h2>
              <p className="text-sm text-gray-400">
                Add a new category for organizing learning modules.
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple transition-colors"
                  placeholder="e.g., Deep Learning"
                  autoFocus
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple transition-colors resize-none"
                  placeholder="Brief description of the category..."
                />
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Image *
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 hover:border-gray-500 focus:outline-none focus:border-purple transition-colors text-left"
                    >
                      {categoryImage ? categoryImage.name : 'Choose image...'}
                    </button>
                  </div>

                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG, GIF, or WebP. Max 5MB.
                </p>
              </div>

              {/* Error Display */}
              {createError && (
                <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                  {createError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="flex-1 px-4 py-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCreating || !newCategoryData.name.trim() || !newCategoryData.description.trim() || !categoryImage}
                >
                  {isCreating ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};