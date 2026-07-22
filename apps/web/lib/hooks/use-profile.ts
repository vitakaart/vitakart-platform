// File: apps/web/lib/hooks/use-profile.ts
// Custom hook for profile update

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { UpdateProfileInput } from "@/types/api";

export function useUpdateProfile() {
  const { user, setUser } = useAuthStore();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => authApi.updateProfile(data),
    onSuccess: (data) => {
      // Update local auth store with new user data
      if (user) {
        setUser({
          ...user,
          fullName: data.fullName,
          phone: data.phone,
        });
      }
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
      console.error("Update profile error:", error);
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}