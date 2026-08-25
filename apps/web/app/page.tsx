// File: apps/web/app/page.tsx
import { MainLayout } from "@/components/layout/main-layout";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { DealBanner } from "@/components/home/deal-banner";
import { BestSellers } from "@/components/home/best-sellers";
import { SecureDelivery } from "@/components/home/secure-delivery";
import { VitaminsSection } from "@/components/home/vitamins-section";
import { AyurvedaSection } from "@/components/home/ayurveda-section";
import { DiscountCode } from "@/components/home/discount-code";
import { TrustBadges } from "@/components/home/trust-badges";
import { BrandStory } from "@/components/home/brand-story";
import { PartnerBrands } from "@/components/home/partner-brands";
import { Testimonials } from "@/components/home/testimonials";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { NewsletterCTA } from "@/components/home/newsletter-cta";


export default function HomePage() {
  return (
    <MainLayout>
        <HeroSlider />
      <main className="mx-auto flex container-app flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:gap-10">
      
        <CategoryGrid /> {/* this is come from data fetch */}
        {/* <FeaturedProducts /> */}
        {/* <DealBanner /> */}
        <BestSellers />
        <SecureDelivery />
        <VitaminsSection />{/* this is come from data fetch */}
        <AyurvedaSection />{/* this is come from data fetch */}
        <DiscountCode />{/* this is come from data fetch */}
        <TrustBadges />
        <BrandStory />
        {/* <PartnerBrands /> */}
        {/* <Testimonials /> */}
        <InstagramGrid />
        <NewsletterCTA />
        {/* <CategoryGrid /> */}
      </main>
    </MainLayout>
  );
}