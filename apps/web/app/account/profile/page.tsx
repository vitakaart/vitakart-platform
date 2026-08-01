// File: apps/web/app/account/profile/page.tsx
// Clean orchestrator — 40 lines only!

"use client";

import { AccountLayout } from "@/components/account/account-layout";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ProfileAvatarCard } from "@/components/account/profile/profile-avatar-card";
import { ProfileForm } from "@/components/account/profile/profile-form";
import { SecurityLinks } from "@/components/account/profile/security-links";

import { useAuth } from "@/lib/hooks/use-auth";
import { ROUTES } from "@/lib/constants/routes";

function ProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <AccountPageHeader
        title="Profile Details"
        subtitle="Manage your personal information"
        backHref={ROUTES.ACCOUNT}
      />

      <div className="space-y-6">
        {/* Avatar + User Info */}
        <ProfileAvatarCard user={user} />

        {/* Name + Phone Form */}
        <ProfileForm user={user} />

        {/* Security Quick Links */}
        <SecurityLinks />
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <AccountLayout>
      <ProfileContent />
    </AccountLayout>
  );
}