'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchAllCategories } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface CategorySelectorProps {
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const isSelected = selectedCategories.includes(categoryName);
    
    if (isSelected) {
      onCategoriesChange(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      onCategoriesChange([...selectedCategories, categoryName]);
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
          {selectedCategories.map(categoryName => (
            <span
              key={categoryName}
              className="inline-flex items-center px-3 py-1 bg-purple/20 text-purple-300 rounded-full text-sm"
            >
              {categoryName}
              <button
                type="button"
                onClick={() => handleCategoryToggle(categoryName)}
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
              className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
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
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => {}} // Handled by parent div click
                    className="w-4 h-4 text-purple bg-gray-700 border-gray-600 rounded focus:ring-purple focus:ring-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};