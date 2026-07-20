"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Loader2,
  ArrowRight,
  Home,
  ShoppingBag,
  Calendar,
  Clock,
  Printer,
  Share2,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useOrderByNumber } from "@/lib/hooks/use-orders";
import { ROUTES } from "@/lib/constants/routes";
import { PaymentMethod } from "@/types/api";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

// ─── Confetti Animation (CSS keyframes) ────────────────────────────
function Confetti() {
  const colors = ["#10B981", "#34D399", "#F59E0B", "#FCD34D", "#6EE7B7"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Status Step Component ─────────────────────────────────────────
function StatusStep({
  icon: Icon,
  title,
  description,
  completed,
  active,
  time,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  completed: boolean;
  active?: boolean;
  time?: string;
}) {
  return (
    <div className="flex gap-4 relative group">
      {/* Icon Circle */}
      <div
        className={`
          w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 transition-all duration-500
          ${completed
            ? "bg-primary-500 text-white shadow-md shadow-primary-200"
            : active
            ? "bg-accent-100 text-accent-600 border-2 border-accent-400 animate-pulse"
            : "bg-[#F5F1E8] text-[#6B665D] border-2 border-[#E9E1D2]"
          }
        `}
      >
        <Icon className="w-5 h-5" strokeWidth={completed ? 2.5 : 2} />
      </div>

      {/* Connector Line */}
      <div
        className={`absolute left-5 top-11 w-0.5 h-full transition-colors duration-500 ${
          completed ? "bg-primary-400" : "bg-[#E9E1D2]"
        }`}
      />

      {/* Text */}
      <div className="flex-1 pb-8">
        <h4
          className={`text-sm font-bold ${
            completed ? "text-[#0A0A0A]" : active ? "text-accent-700" : "text-[#6B665D]"
          }`}
        >
          {title}
          {completed && <span className="ml-1.5 text-primary-500">✓</span>}
        </h4>
        <p className="text-xs text-[#6B665D] mt-0.5 leading-relaxed">{description}</p>
        {time && (
          <div className="flex items-center gap-1 mt-1.5">
            <Clock className="w-3 h-3 text-primary-400" />
            <p className="text-[10px] text-primary-600 font-semibold">{time}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order Item Card ───────────────────────────────────────────────
function OrderItemCard({ item }: { item: any }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-[#FAFAF7] border border-[#E9E1D2] hover:border-primary-200 hover:shadow-sm transition-all duration-200 group">
      {/* Image */}
      <div className="w-16 h-16 rounded-lg bg-white border border-[#E9E1D2] overflow-hidden flex-shrink-0 relative">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F1E8]">
            <Package className="w-6 h-6 text-[#6B665D]" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          {item.productBrand && (
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.15em]">
              {item.productBrand}
            </p>
          )}
          <h4 className="text-sm font-bold text-[#0A0A0A] line-clamp-2 leading-snug">
            {item.productName}
          </h4>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-md">
              {item.quantity}x
            </span>
            <span className="text-xs text-[#6B665D]">
              @ ₹{item.unitPrice?.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-sm font-black text-[#0A0A0A]">
            ₹{item.totalPrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────
function OrderSuccessContent({ orderNumber }: { orderNumber: string }) {
  const { data: order, isLoading, isError } = useOrderByNumber(orderNumber);

  // Loading
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-primary-100 animate-ping opacity-20" />
          </div>
          <p className="mt-4 text-sm text-[#6B665D] font-medium">Fetching your order details...</p>
        </div>
      </MainLayout>
    );
  }

  // Error
  if (isError || !order) {
    return (
      <MainLayout>
        <div className="container-app py-20 text-center max-w-md mx-auto animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Order Not Found</h1>
          <p className="text-sm text-[#6B665D] mb-8 leading-relaxed">
            We couldn&apos;t find this order. It may have been removed or the link is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href={ROUTES.ORDERS}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-white border-2 border-[#E9E1D2] text-[#0A0A0A] font-semibold hover:border-primary-400 hover:text-primary-600 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              My Orders
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const paymentMethodLabel =
    order.paymentMethod === PaymentMethod.COD
      ? "Cash on Delivery"
      : "Online Payment";

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const orderTime = new Date(order.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <MainLayout>
      <div className="container-app py-6 md:py-10 max-w-4xl relative">
        <Confetti />

        {/* ─── Success Hero ─────────────────────────────── */}
        <div className="text-center py-10 md:py-14 animate-scale-in">
          {/* Animated Check Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary-50 mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-primary-400/20 animate-ping" />
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-xl shadow-primary-500/30 relative">
              <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-[#0A0A0A] mb-3 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm md:text-base text-[#6B665D] mb-6 max-w-md mx-auto leading-relaxed">
            Thank you for choosing Vitakart. Your wellness products are on their way!
          </p>

          {/* Order Number Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#F5F1E8] border-2 border-[#E9E1D2]">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#6B665D]" />
              <span className="text-xs font-bold text-[#6B665D] uppercase tracking-wider">Order ID</span>
            </div>
            <span className="text-base font-black text-[#0A0A0A] tracking-wide">
              {order.orderNumber}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.orderNumber);
                // Could add toast here
              }}
              className="text-[10px] font-bold text-primary-600 hover:text-primary-700 underline cursor-pointer"
            >
              Copy
            </button>
          </div>

          {/* Date & Payment */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#6B665D]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {orderDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#E9E1D2]" />
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {orderTime}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#E9E1D2]" />
            <span className="font-semibold text-primary-600">{paymentMethodLabel}</span>
          </div>
        </div>

        {/* ─── Order Status Timeline ────────────────────── */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A0A0A] mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary-500" />
            Order Status
          </h2>

          <div className="relative pl-2">
            {[
              {
                icon: CheckCircle2,
                title: "Order Placed",
                description: "Your order has been received and confirmed",
                completed: true,
                time: `${orderDate} at ${orderTime}`,
              },
              {
                icon: Package,
                title: "Processing",
                description: "We're carefully packing your wellness products",
                completed: false,
                active: true,
              },
              {
                icon: Truck,
                title: "Shipped",
                description: "On the way to your delivery address",
                completed: false,
              },
              {
                icon: Star,
                title: "Delivered",
                description: "Enjoy your premium health products!",
                completed: false,
              },
            ].map((step, i, arr) => (
              <StatusStep
                key={step.title}
                {...step}
                active={step.active}
              />
            ))}
          </div>
        </div>

        {/* ─── Order Items ──────────────────────────────── */}
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A0A0A] mb-5 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            Order Items
            <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-md">
              {order.items.length}
            </span>
          </h2>

          <div className="space-y-3">
            {order.items.map((item: any) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* ─── Two Column: Address + Summary ────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold text-[#0A0A0A]">Delivery Address</h2>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-bold text-[#0A0A0A] text-base">{order.shippingFullName}</p>
              <div className="h-px bg-[#E9E1D2] my-3" />
              <p className="text-[#6B665D] leading-relaxed">
                {order.shippingAddressLine1}
                {order.shippingAddressLine2 && `, ${order.shippingAddressLine2}`}
              </p>
              {order.shippingLandmark && (
                <p className="text-accent-600 text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Near {order.shippingLandmark}
                </p>
              )}
              <p className="text-[#6B665D] font-medium">
                {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
              </p>
              <p className="text-[#6B665D] text-xs">{order.shippingCountry}</p>

              <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#E9E1D2]">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-[#0A0A0A] font-semibold">{order.shippingPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E9E1D2] p-5 md:p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0A0A0A] mb-5 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent-500" />
              Payment Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B665D]">Subtotal</span>
                <span className="font-semibold text-[#0A0A0A]">
                  ₹{(order.subtotal + order.totalDiscount).toLocaleString("en-IN")}
                </span>
              </div>

              {order.totalDiscount > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#6B665D] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary-500" />
                    Discount
                  </span>
                  <span className="font-bold text-primary-600">
                    -₹{order.totalDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B665D]">Shipping</span>
                {order.shippingFee === 0 ? (
                  <span className="font-bold text-primary-600 flex items-center gap-1">
                    <span className="text-lg">🚚</span> FREE
                  </span>
                ) : (
                  <span className="font-semibold text-[#0A0A0A]">
                    ₹{order.shippingFee.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="h-px bg-[#E9E1D2] my-2" />

              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-[#0A0A0A] text-base">Total Paid</span>
                <span className="text-2xl font-black text-[#0A0A0A]">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>

              {order.totalDiscount > 0 && (
                <p className="text-xs text-primary-600 font-semibold text-right">
                  You saved ₹{order.totalDiscount.toLocaleString("en-IN")}!
                </p>
              )}

              <div className="h-px bg-[#E9E1D2] my-2" />

              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-[#6B665D]">Payment Method</span>
                <span className="text-xs font-bold text-[#0A0A0A] bg-[#F5F1E8] px-2 py-1 rounded-md">
                  {paymentMethodLabel}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-xs text-[#6B665D]">Order Status</span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Delivery Info Banner ─────────────────────── */}
        <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-primary-200">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary-800">
              Expected Delivery: 3-5 Business Days
            </p>
            <p className="text-xs text-primary-600 mt-1 leading-relaxed">
              You&apos;ll receive tracking information via email and SMS once your order ships. 
              Need help? Contact us at <span className="font-semibold">hello@vitakart.com</span>
            </p>
          </div>
        </div>

        {/* ─── Action Buttons ───────────────────────────── */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href={ROUTES.ORDERS}
            className="inline-flex items-center justify-center gap-2 h-13 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            View My Orders
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href={ROUTES.PRODUCTS}
            className="inline-flex items-center justify-center gap-2 h-13 rounded-2xl bg-white border-2 border-[#E9E1D2] text-[#0A0A0A] font-bold hover:border-primary-400 hover:text-primary-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="w-4 h-4" />
            Continue Shopping
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 h-13 rounded-2xl bg-[#F5F1E8] border-2 border-[#E9E1D2] text-[#0A0A0A] font-bold hover:border-primary-400 hover:text-primary-600 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>

        {/* ─── Share Section ────────────────────────────── */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#6B665D] font-medium mb-3">Share your wellness journey</p>
          <div className="flex items-center justify-center gap-2">
            {["WhatsApp", "Facebook", "Twitter", "Copy Link"].map((platform) => (
              <button
                key={platform}
                className="px-4 py-2 rounded-xl bg-white border border-[#E9E1D2] text-xs font-semibold text-[#6B665D] hover:border-primary-400 hover:text-primary-600 transition-all hover:-translate-y-0.5"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// ─── Page Export ───────────────────────────────────────────────────
export default function OrderSuccessPage({ params }: Props) {
  const { orderNumber } = use(params);

  return (
    <ProtectedRoute>
      <OrderSuccessContent orderNumber={orderNumber} />
    </ProtectedRoute>
  );
}