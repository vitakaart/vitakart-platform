// File: apps/web/app/account/profile/components/profile-avatar-card.tsx
// Avatar section with image upload + user info

"use client";

import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/shared/image-upload";
import { useUpdateProfile } from "@/lib/hooks/use-profile";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { User } from "@/types/api";

interface ProfileAvatarCardProps {
  user: User;
}

export function ProfileAvatarCard({ user }: ProfileAvatarCardProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const { updateProfile } = useUpdateProfile();

  // Auto-save image on upload
  const handleImageUpload = (url: string) => {
    updateProfile(
      {
        fullName: user.fullName,
        phone: user.phone || undefined,
        profileImage: url,
      },
      {
        onSuccess: (updatedUser) => {
          setUser({
            ...user,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
          });
          toast.success("Profile photo updated! 📸");
        },
      }
    );
  };

  // Auto-save on remove
  const handleImageRemove = () => {
    updateProfile(
      {
        fullName: user.fullName,
        phone: user.phone || undefined,
        profileImage: undefined,
      },
      {
        onSuccess: (updatedUser) => {
          setUser({
            ...user,
            fullName: updatedUser.fullName,
            phone: updatedUser.phone,
            profileImage: null,
          });
          toast.success("Photo removed");
        },
      }
    );
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      {/* Avatar + Info */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <ImageUpload
            currentImageUrl={user.profileImage}
            folder="profiles"
            onUploadSuccess={handleImageUpload}
            onRemove={handleImageRemove}
            variant="avatar"
            size="md"
            maxSizeMB={2}
          />

          {/* Verified Badge */}
          {user.isVerified && (
            <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white z-10">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-slate-900">
            {user.fullName}
          </h2>
          <p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <UserRoleBadge role={user.role} />
            {user.isVerified && <VerifiedBadge />}
          </div>
        </div>
      </div>

    
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS (kept in same file — small)
// ==========================================

function UserRoleBadge({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
      {role}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
      <ShieldCheck className="h-2.5 w-2.5" strokeWidth={3} />
      Verified
    </span>
  );
}