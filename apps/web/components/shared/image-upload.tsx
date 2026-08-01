// File: apps/web/components/shared/image-upload.tsx
// Server-side upload via backend (reliable)

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api/client";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  folder?: string;
  onUploadSuccess: (url: string, publicId: string) => void;
  onRemove?: () => void;
  variant?: "avatar" | "banner" | "card";
  size?: "sm" | "md" | "lg";
  maxSizeMB?: number;
  className?: string;
}

const SIZE_MAP = {
  avatar: {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  },
  banner: {
    sm: "w-full h-32",
    md: "w-full h-48",
    lg: "w-full h-64",
  },
  card: {
    sm: "w-full h-40",
    md: "w-full h-56",
    lg: "w-full h-72",
  },
};

export function ImageUpload({
  currentImageUrl,
  folder,
  onUploadSuccess,
  onRemove,
  variant = "avatar",
  size = "md",
  maxSizeMB = 5,
  className,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File too large. Max: ${maxSizeMB} MB`);
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Show preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setIsUploading(true);

    try {
      // Upload via our backend
      const formData = new FormData();
      formData.append("file", file);

      const params = folder ? { folder } : undefined;

      const response = await apiClient.post("/images/upload", formData, {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.success && data.secureUrl && data.publicId) {
        console.log("✅ Upload success:", data.secureUrl);
        onUploadSuccess(data.secureUrl, data.publicId);
        setPreviewUrl(null);
        toast.success("Image uploaded! 📸");
      } else {
        throw new Error(data.errorMessage || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onRemove?.();
  };

  const displayUrl = previewUrl || currentImageUrl;
  const sizeClass = SIZE_MAP[variant][size];

  // ==========================================
  // AVATAR VARIANT
  // ==========================================
  if (variant === "avatar") {
    return (
      <div className={cn("relative inline-block group", className)}>
        <div
          onClick={handleClick}
          className={cn(
            "relative rounded-full overflow-hidden bg-stone-100 border-4 border-white shadow-md cursor-pointer transition-transform hover:scale-105",
            sizeClass,
            isUploading && "cursor-wait"
          )}
        >
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Profile"
              fill
              className="object-cover"
              sizes="200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white text-3xl font-bold">
              <Camera className="w-1/2 h-1/2 opacity-50" />
            </div>
          )}

          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity",
              isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Camera button badge */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all disabled:opacity-50"
          aria-label="Change photo"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </button>

        {/* Remove button */}
        {displayUrl && onRemove && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all"
            aria-label="Remove photo"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // ==========================================
  // BANNER / CARD VARIANT
  // ==========================================
  return (
    <div className={cn("relative group", className)}>
      <div
        onClick={handleClick}
        className={cn(
          "relative rounded-xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 cursor-pointer transition-all hover:border-primary-400 hover:bg-stone-50",
          sizeClass,
          isUploading && "cursor-wait"
        )}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt="Uploaded"
              fill
              className="object-cover"
            />
            <div
              className={cn(
                "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity",
                isUploading
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-bold">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white">
                  <Camera className="w-8 h-8" />
                  <span className="text-sm font-medium">Change Image</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-500">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 animate-spin mb-2 text-primary-500" />
                <span className="text-sm font-bold text-stone-900">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs mt-1">
                  Max {maxSizeMB} MB • JPG, PNG, WEBP
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Remove button */}
      {displayUrl && onRemove && !isUploading && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="Remove image"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}