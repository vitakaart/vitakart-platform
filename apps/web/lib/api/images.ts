// File: apps/web/lib/api/images.ts
// Image upload API calls

import apiClient from "./client";
import type { ImageUploadResponse } from "@/types/api";

export const imagesApi = {
  // Upload single image
  upload: async (
    file: File,
    folder?: string
  ): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const params = folder ? { folder } : undefined;

    const response = await apiClient.post<ImageUploadResponse>(
      "/images/upload",
      formData,
      {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Upload multiple images
  uploadMultiple: async (
    files: File[],
    folder?: string
  ): Promise<ImageUploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const params = folder ? { folder } : undefined;

    const response = await apiClient.post<ImageUploadResponse[]>(
      "/images/upload-multiple",
      formData,
      {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Delete image
  delete: async (publicId: string): Promise<void> => {
    // publicId can have slashes (folder/name), encode it
    const encoded = encodeURIComponent(publicId);
    await apiClient.delete(`/images/${encoded}`);
  },
};