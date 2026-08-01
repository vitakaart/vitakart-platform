// File: apps/web/lib/hooks/use-image-upload.ts
// Reusable image upload hook

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { imagesApi } from "@/lib/api/images";
import { getErrorMessage } from "@/lib/api/client";
import type { ImageUploadResponse } from "@/types/api";

interface UseImageUploadOptions {
  folder?: string;
  onSuccess?: (result: ImageUploadResponse) => void;
  showToast?: boolean;
}

// Upload single image
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { folder, onSuccess, showToast = true } = options;

  return useMutation({
    mutationFn: (file: File) => imagesApi.upload(file, folder),
    onSuccess: (result) => {
      if (result.success) {
        if (showToast) {
          toast.success("Image uploaded successfully!");
        }
        onSuccess?.(result);
      } else {
        toast.error(result.errorMessage || "Upload failed");
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Delete image
export function useImageDelete() {
  return useMutation({
    mutationFn: (publicId: string) => imagesApi.delete(publicId),
    onSuccess: () => {
      toast.success("Image deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}