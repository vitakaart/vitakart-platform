// apps/web/app/account/page.tsx
"use client";

import { Heart, Package, Sparkles } from "lucide-react";
import { AccountLayout } from "@/components/account/account-layout";
import { AccountStatCard } from "@/components/account/account-stat-card";
import { AccountMenuCard } from "@/components/account/account-menu-card";
import { AccountHeroDesktop } from "@/components/account/account-hero-desktop";
import { AccountHeroMobile } from "@/components/account/account-hero-mobile";
import { AccountStatMobile } from "@/components/account/account-stat-mobile";
import { AccountSectionHeader } from "@/components/account/account-section-header";
import { AccountSignoutButton } from "@/components/account/account-signout-button";
import { ACCOUNT_MENU_ITEMS } from "@/components/account/account-menu-items";
import { useAuth } from "@/lib/hooks/use-auth";
import { useMyOrders } from "@/lib/hooks/use-orders";
import { useWishlistCount } from "@/lib/hooks/use-wishlist";
import { ROUTES } from "@/lib/constants/routes";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  return (
    <AccountLayout>
      <AccountDashboard />
    </AccountLayout>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function AccountDashboard() {
  const { user } = useAuth();
  const { data: wishlistData, isLoading: isLoadingWishlist } =
    useWishlistCount();
  const { data: ordersData, isLoading: isLoadingOrders } = useMyOrders({
    page: 1,
    pageSize: 1,
  });

  if (!user) return null;

  const wishlistCount = wishlistData?.count ?? 0;
  const totalOrders = ordersData?.totalCount ?? 0;

  return (
    <>
      {/* ═══════════════════════════════════
          DESKTOP CONTENT
      ═══════════════════════════════════ */}
      <div className="hidden space-y-6 lg:block">
        <AccountHeroDesktop
          userName={user.fullName}
          isVerified={user.isVerified}
        />

        {/* Stats */}
        <section>
          <AccountSectionHeader
            title="Overview"
            subtitle="Your account at a glance"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <AccountStatCard
              icon={Package}
              label="Total Orders"
              value={totalOrders.toString()}
              href={ROUTES.ORDERS}
              gradient="from-blue-500 to-blue-600"
              iconBg="bg-blue-50 text-blue-600"
              loading={isLoadingOrders}
            />
            <AccountStatCard
              icon={Heart}
              label="Wishlist Items"
              value={wishlistCount.toString()}
              href={ROUTES.WISHLIST}
              gradient="from-rose-500 to-rose-600"
              iconBg="bg-rose-50 text-rose-600"
              loading={isLoadingWishlist}
            />
            <AccountStatCard
              icon={Sparkles}
              label="Reward Points"
              value="0"
              comingSoon
              gradient="from-amber-500 to-amber-600"
              iconBg="bg-amber-50 text-amber-600"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <AccountSectionHeader
            title="Quick Actions"
            subtitle="Manage your account settings"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {ACCOUNT_MENU_ITEMS.map((item) => (
              <AccountMenuCard key={item.href} {...item} />
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════
          MOBILE CONTENT
      ═══════════════════════════════════ */}
      <div className="lg:hidden">
        <AccountHeroMobile
          userName={user.fullName}
          email={user.email}
          role={user.role}
          isVerified={user.isVerified}
        />

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <AccountStatMobile
            icon={Package}
            label="Orders"
            value={totalOrders.toString()}
            href={ROUTES.ORDERS}
            color="blue"
            loading={isLoadingOrders}
          />
          <AccountStatMobile
            icon={Heart}
            label="Wishlist"
            value={wishlistCount.toString()}
            href={ROUTES.WISHLIST}
            color="rose"
            loading={isLoadingWishlist}
          />
          <AccountStatMobile
            icon={Sparkles}
            label="Points"
            value="—"
            color="amber"
            comingSoon
          />
        </div>

        {/* Menu */}
        <div className="mt-6">
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Account
          </p>
          <div className="space-y-2.5">
            {ACCOUNT_MENU_ITEMS.map((item) => (
              <AccountMenuCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div className="mt-8">
          <AccountSignoutButton />
        </div>
      </div>
    </>
  );
}