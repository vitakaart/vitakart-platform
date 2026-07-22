// File: apps/web/app/account/orders/[id]/page.tsx
// Desktop: Full page | Mobile: Bottom sheet

"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { OrderDetailContent } from "@/components/orders/detail/order-detail-content";
import { useOrderDetail } from "@/components/orders/detail/use-order-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { order, isLoading, isError, refetch, cancelOrder, isCancelling } =
    useOrderDetail(id);

  const [isMobile, setIsMobile] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Detect mobile & auto-open sheet
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSheetOpen(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClose = () => {
    setSheetOpen(false);
    // Wait for animation, then navigate back
    setTimeout(() => router.push("/account/orders"), 300);
  };

  // Loading
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        </div>
      </MainLayout>
    );
  }

  // Error
  if (isError) {
    return (
      <MainLayout>
        <div className="container-app max-w-3xl py-8">
          <ErrorState
            title="Failed to load order"
            onRetry={() => refetch()}
          />
        </div>
      </MainLayout>
    );
  }

  // Not found
  if (!order) {
    return (
      <MainLayout>
        <div className="container-app max-w-3xl py-8">
          <EmptyState
            icon="📦"
            title="Order not found"
            description="This order doesn't exist or you don't have access."
            size="lg"
          />
        </div>
      </MainLayout>
    );
  }

  // ==========================================
  // MOBILE: Bottom Sheet
  // ==========================================
  if (isMobile) {
    return (
      <MainLayout>
        <BottomSheet
          isOpen={sheetOpen}
          onClose={handleClose}
          maxHeight="94vh"
        >
          <OrderDetailContent
            order={order}
            isMobile
            onClose={handleClose}
            onCancel={cancelOrder}
            isCancelling={isCancelling}
          />
        </BottomSheet>
      </MainLayout>
    );
  }

  // ==========================================
  // DESKTOP: Full page
  // ==========================================
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FAFAF7] pb-20 md:pb-12">
        <div className="container-app max-w-3xl py-4 md:py-8">
          <OrderDetailContent
            order={order}
            onCancel={cancelOrder}
            isCancelling={isCancelling}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default function Page({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <OrderDetailPage params={params} />
    </ProtectedRoute>
  );
}