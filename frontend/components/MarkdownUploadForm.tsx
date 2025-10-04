'use client';

import React, { useState, useRef } from 'react';
import { CategorySelector } from './CategorySelector';
import { Button } from '@/components/ui/button';
import { uploadLearnModule } from '@/lib/api';

interface ActionButton {
  name: string;
  link: string;
}

interface MarkdownUploadFormProps {
  markdownContent: string;
  onUploadSuccess: (moduleId: string) => void;
  className?: string;
}

export const MarkdownUploadForm: React.FC<MarkdownUploadFormProps> = ({
  markdownContent,
  onUploadSuccess,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [] as string[],
    actionButtons: [] as ActionButton[]
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newActionButton, setNewActionButton] = useState({ name: '', link: '' });
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Please upload an image smaller than 5MB.');
      return;
    }

    setThumbnail(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addActionButton = () => {
    if (newActionButton.name.trim() && newActionButton.link.trim()) {
      setFormData(prev => ({
        ...prev,
        actionButtons: [...prev.actionButtons, { ...newActionButton }]
      }));
      setNewActionButton({ name: '', link: '' });
    }
  };

  const removeActionButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actionButtons: prev.actionButtons.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.categories.length === 0) {
      setError('At least one category is required');
      return false;
    }
    if (!thumbnail) {
      setError('Thumbnail image is required');
      return false;
    }
    if (!markdownContent.trim()) {
      setError('Markdown content is required');
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
      
      const uploadData = new FormData();
      uploadData.append('title', formData.title.trim());
      uploadData.append('description', formData.description.trim());
      uploadData.append('content', markdownContent);
      uploadData.append('categories', JSON.stringify(formData.categories));
      uploadData.append('action_buttons', JSON.stringify(formData.actionButtons));
      uploadData.append('thumbnail', thumbnail!);

      const result = await uploadLearnModule(uploadData);
      
      // Clear form on success
      setFormData({
        title: '',
        description: '',
        categories: [],
        actionButtons: []
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      
      onUploadSuccess(result.id);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload learn module');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        📚 Upload Learning Module
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple transition-colors"
            placeholder="Enter module title..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple transition-colors resize-none"
            placeholder="Brief description of the learning module..."
            required
          />
        </div>

        {/* Categories */}
        <CategorySelector
          selectedCategories={formData.categories}
          onCategoriesChange={(categories) => handleInputChange('categories', categories)}
        />

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail Image *
          </label>
          
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-300 hover:border-gray-500 focus:outline-none focus:border-purple transition-colors text-left"
              >
                {thumbnail ? thumbnail.name : 'Choose thumbnail image...'}
              </button>
            </div>
            
            {thumbnailPreview && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Action Buttons (Optional)
          </label>
          
          {/* Existing Action Buttons */}
          {formData.actionButtons.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.actionButtons.map((button, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-700/50 rounded border border-gray-600">
                  <span className="flex-1 text-sm text-gray-300">
                    <strong>{button.name}</strong> → {button.link}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActionButton(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
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
              onChange={(e) => setNewActionButton(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple text-sm"
            />
            <input
              type="url"
              placeholder="Button link"
              value={newActionButton.link}
              onChange={(e) => setNewActionButton(prev => ({ ...prev, link: e.target.value }))}
              className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple text-sm"
            />
            <button
              type="button"
              onClick={addActionButton}
              disabled={!newActionButton.name.trim() || !newActionButton.link.trim()}
              className="px-3 py-2 bg-purple/20 text-purple-300 rounded border border-purple/30 hover:bg-purple/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content Preview
          </label>
          <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg text-sm text-gray-400">
            {markdownContent.trim() ? (
              <div>
                <div>Characters: {markdownContent.length}</div>
                <div>Words: {markdownContent.split(/\s+/).filter(word => word.length > 0).length}</div>
                <div>Lines: {markdownContent.split('\n').length}</div>
              </div>
            ) : (
              'No content in editor'
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
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
          {isUploading ? 'Uploading...' : 'Upload Learning Module'}
        </Button>
      </form>
    </div>
  );
};