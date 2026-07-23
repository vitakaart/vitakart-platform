// File: apps/web/app/products/[slug]/page.tsx
// Product Detail Page — Dynamic route

"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ErrorState } from "@/components/shared/error-state";
import { ProductGallery } from "@/components/product-detail/product-gallery";
import { ProductInfo } from "@/components/product-detail/product-info";
import { FeatureBadges } from "@/components/product-detail/feature-badges";
import { ProductTabs } from "@/components/product-detail/product-tabs";
import { AyurvedaBanner } from "@/components/product-detail/ayurveda-banner";
import { FrequentlyBoughtTogether } from "@/components/product-detail/frequently-bought-together";
import { ReviewsSection } from "@/components/product-detail/reviews-section";
import { RelatedProducts } from "@/components/product-detail/related-products";
import { productsApi } from "@/lib/api/products";
import { ROUTES } from "@/lib/constants/routes";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => productsApi.getBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["related-products", product?.categoryId],
    queryFn: async () => {
      if (!product?.categoryId) return [];
      const result = await productsApi.getByCategory(product.categoryId, {
        page: 1,
        pageSize: 8,
      });
      return result.items.filter((p) => p.id !== product.id);
    },
    enabled: !!product?.categoryId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ["bundle-products"],
    queryFn: () => productsApi.getFeatured(4),
    staleTime: 5 * 60 * 1000,
  });

  const bundleProducts = featuredProducts
    ?.filter((p) => p.id !== product?.id)
    .slice(0, 2) ?? [];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container-app py-6 md:py-8">
          <div className="animate-pulse">
            <div className="h-4 w-64 bg-[#F5F1E8] rounded mb-6" />
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="aspect-square bg-[#F5F1E8] rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 w-24 bg-[#F5F1E8] rounded" />
                <div className="h-8 w-3/4 bg-[#F5F1E8] rounded" />
                <div className="h-4 w-1/2 bg-[#F5F1E8] rounded" />
                <div className="h-10 w-40 bg-[#F5F1E8] rounded" />
                <div className="h-12 w-full bg-[#F5F1E8] rounded" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="container-app py-6 md:py-8">
          <ErrorState
            title="Product not found"
            description="The product you're looking for doesn't exist or has been removed"
            onRetry={() => refetch()}
          />
        </div>
      </MainLayout>
    );
  }

  const galleryImages = product.imageUrl
    ? [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl]
    : [];

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-8">
        <Breadcrumbs
          items={[
            { label: "HOME", href: ROUTES.HOME },
            {
              label: (product.categoryName || "PRODUCTS").toUpperCase(),
              href: ROUTES.CATEGORY(product.categorySlug),
            },
            { label: product.name.toUpperCase() },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
            isBestSeller={product.isFeatured}
          />
          <ProductInfo product={product} categoryName={product.categoryName} />
        </div>

        <div className="mb-8">
          <FeatureBadges />
        </div>

        <div className="mb-8">
          <ProductTabs product={product} />
        </div>

        {/* <div className="mb-8">
          <AyurvedaBanner />
        </div> */}

        {/* <div className="mb-8">
          <FrequentlyBoughtTogether
            mainProduct={product}
            bundleProducts={bundleProducts}
          />
        </div> */}

        <div id="reviews-section" className="mb-8 scroll-mt-24">
          <ReviewsSection productId={product.id} productName={product.name} />
        </div>

        <div className="mb-8">
          <RelatedProducts
            products={relatedProducts ?? []}
            isLoading={isLoadingRelated}
          />
        </div>
      </div>
    </MainLayout>
  );
}