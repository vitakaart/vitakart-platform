// File: apps/web/lib/hooks/use-profile.ts
// Profile update with proper cache invalidation

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { UpdateProfileInput } from "@/types/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      // ✅ 1. Update Zustand store immediately
      if (user) {
        const newUser = {
          ...user,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          profileImage: updatedUser.profileImage,
        };
        setUser(newUser);
      }

      // ✅ 2. Invalidate auth query to refetch fresh
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}