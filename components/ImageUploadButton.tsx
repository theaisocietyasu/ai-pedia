"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/api/learn";

interface UploadedImage {
  id: string;
  url: string;
  markdownCode: string;
  fileName: string;
}

export const ImageUploadButton: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

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

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    // Upload image
    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const markdownCode = `![${file.name}](${result.url})`;

      const newImage: UploadedImage = {
        id: result.imageId,
        url: result.url,
        markdownCode,
        fileName: file.name,
      };

      setUploadedImages((prev) => [...prev, newImage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-3">
      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload-input"
        />
        <label htmlFor="image-upload-input">
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            {isUploading ? "Uploading..." : "📷 Upload Image"}
          </Button>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-400 font-medium">
            Uploaded Images:
          </div>
          {uploadedImages.map((image) => (
            <div
              key={image.id}
              className="bg-dark-gray/50 border border-gray-700 rounded p-2 space-y-2"
            >
              {/* Image Preview */}
              <div className="flex items-center gap-2">
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-300 truncate">
                    {image.fileName}
                  </div>
                </div>
              </div>

              {/* Markdown Code */}
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background/50 px-2 py-1 rounded font-mono text-purple-300 truncate">
                  {image.markdownCode}
                </code>
                <button
                  onClick={() => copyToClipboard(image.markdownCode)}
                  className="text-xs px-2 py-1 bg-purple/20 text-purple-300 rounded border border-purple/30 hover:bg-purple/30 transition-colors"
                  title="Copy markdown code"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
