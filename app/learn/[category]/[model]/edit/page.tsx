'use client'

import React, { useState, useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  SignIn,
} from '@clerk/nextjs'
import { shadesOfPurple } from '@clerk/themes';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { ImageUploadButton } from '@/components/ImageUploadButton';
import { MarkdownUploadForm } from '@/components/MarkdownUploadForm';
import { useRouter, useParams } from 'next/navigation';
import { fetchModuleBySlug, deleteLearnModule } from '@/lib/api';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const modelSlug = Array.isArray(params.model) ? params.model[0] : params.model;

  const [mode, setMode] = useState<'preview' | 'edit'>('edit');
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load existing module data
  useEffect(() => {
    const loadModule = async () => {
      if (!modelSlug) return;

      try {
        setLoading(true);
        const module = await fetchModuleBySlug(modelSlug);

        // Set markdown content
        setMarkdown(module.content || '');

        // Prepare initial data for the form
        setInitialData({
          title: module.title,
          description: module.description,
          categories: module.categories || [],
          actionButtons: module.action_buttions || [],
          thumbnail: module.thumbnail
        });

        setError(null);
      } catch (err) {
        console.error('Error loading module:', err);
        setError('Failed to load module. Please check if the module exists.');
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [modelSlug]);

  const handleUpdateSuccess = (result: any) => {
    setUpdateSuccess(result.newSlug);

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
      console.error('Error deleting module:', err);
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete module');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl text-gray-400">Loading module data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <button
            onClick={() => router.push(`/learn/${params.category}`)}
            className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
          <SignIn
            appearance={{
              theme: shadesOfPurple
            }}
            routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        {/* Header/Navbar */}
        <div className="border-b border-gray-800 bg-dark-gray">
          <header className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center w-full">
              {/* Logo or Title */}
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mr-8">
                Edit Learning Module
              </h1>
              {/* Mode Toggle */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                  <button
                    onClick={() => setMode('preview')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      mode === 'preview'
                        ? 'bg-purple text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    👁️ Preview Mode
                  </button>
                  <button
                    onClick={() => setMode('edit')}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      mode === 'edit'
                        ? 'bg-purple text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    ✏️ Edit Mode
                  </button>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm bg-red-900/30 text-red-400 border border-red-800 rounded-md hover:bg-red-900/50 transition-colors"
                  disabled={isDeleting}
                >
                  🗑️ Delete Module
                </button>
                <button
                  onClick={() => router.push(`/learn/${params.category}/${modelSlug}`)}
                  className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                >
                  ← Cancel & Go Back
                </button>
              </div>
            </div>
          </header>
          <p className="text-gray-400 mt-1 px-6 pb-4">
            {mode === 'preview'
              ? 'Edit markdown on the left and see the live preview on the right'
              : 'Update the module details and content'
            }
          </p>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-6 py-4">
            ✅ Learning module updated successfully! Redirecting...
          </div>
        )}

        {/* Delete Error Message */}
        {deleteError && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-6 py-4">
            ❌ {deleteError}
          </div>
        )}

        {/* Deleting Message */}
        {isDeleting && (
          <div className="bg-yellow-900/20 border border-yellow-500 text-yellow-400 px-6 py-4">
            🗑️ Deleting module... Please wait.
          </div>
        )}

        {/* Editor Layout */}
        <div className="flex">
          {mode === 'preview' ? (
            <>
              {/* Editor Panel */}
              <div className="w-1/2 border-r border-gray-800 bg-dark-gray split-separator">
                <div className="h-full flex flex-col">
                  {/* Editor Header */}
                  <div className="border-b border-gray-800 px-4 py-2 bg-background">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-gray-300">
                        📝 Markdown Editor
                      </h2>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Lines: {markdown.split('\n').length}</span>
                        <span>Words: {markdown.split(/\s+/).filter(word => word.length > 0).length}</span>
                        <span>Chars: {markdown.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="border-b border-gray-800 px-4 py-3 bg-background/50">
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
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 max-w-xs opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
                      <div className="font-medium mb-2 text-blue-purple">✨ Quick Reference</div>
                      <div className="space-y-1 font-mono">
                        <div># Heading 1</div>
                        <div>## Heading 2</div>
                        <div>**bold** *italic*</div>
                        <div>`inline code`</div>
                        <div>```python</div>
                        <div>code block</div>
                        <div>```</div>
                        <div>$$math equation$$</div>
                        <div className="text-purple-300">&lt;div id="VZ-name"&gt;&lt;/div&gt;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="w-1/2 bg-background">
                <div className="h-full flex flex-col">
                  {/* Preview Header */}
                  <div className="border-b border-gray-800 px-4 py-2 bg-dark-gray">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-gray-300">
                        👁️ Live Preview
                      </h2>
                      <button
                        onClick={() => setMarkdown('')}
                        className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded border border-gray-600 hover:bg-gray-600 transition-colors"
                      >
                        🗑️ Clear All
                      </button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="flex-1 overflow-y-auto preview-container">
                    {markdown.trim() ? (
                      <MarkdownRenderer content={markdown} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center max-w-md">
                          <div className="text-6xl mb-4">📝✨</div>
                          <div className="text-lg mb-2 text-gray-400">No content to preview</div>
                          <div className="text-sm text-gray-500 leading-relaxed">
                            Start typing markdown in the editor to see the live preview.
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
                <div className="w-1/2 border-r border-gray-800 overflow-y-auto">
                  <div className="p-6">
                    <MarkdownUploadForm
                      mode="edit"
                      moduleSlug={modelSlug}
                      markdownContent={markdown}
                      initialData={initialData}
                      onUploadSuccess={() => {}} // Not used in edit mode
                      onUpdateSuccess={handleUpdateSuccess}
                    />
                  </div>
                </div>

                {/* Content Preview Panel */}
                <div className="w-1/2 bg-background">
                  <div className="h-full flex flex-col">
                    {/* Preview Header */}
                    <div className="border-b border-gray-800 px-4 py-2 bg-dark-gray">
                      <h2 className="text-sm font-medium text-gray-300">
                        👁️ Content Preview
                      </h2>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 overflow-y-auto preview-container">
                      {markdown.trim() ? (
                        <MarkdownRenderer content={markdown} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center max-w-md">
                            <div className="text-6xl mb-4">📚✨</div>
                            <div className="text-lg mb-2 text-gray-400">No content available</div>
                            <div className="text-sm text-gray-500 leading-relaxed">
                              The module content is empty. Switch to Preview Mode to edit the markdown content.
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-gray border border-gray-700 rounded-lg max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Delete Learning Module?</h2>
                <p className="text-gray-300 mb-1">
                  Are you sure you want to delete <span className="font-semibold text-white">{initialData?.title}</span>?
                </p>
                <p className="text-sm text-gray-400">
                  This action cannot be undone. All content will be permanently deleted.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDelete();
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}
