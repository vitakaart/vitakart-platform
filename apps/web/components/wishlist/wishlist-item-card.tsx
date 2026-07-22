// File: apps/web/components/wishlist/wishlist-item-card.tsx
// Same design as ProductCardCompact but with delete instead of wishlist

"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Package, Trash2, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/lib/constants/routes";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRemoveFromWishlist } from "@/lib/hooks/use-wishlist";
import type { WishlistItem } from "@/types/api";

interface WishlistItemCardProps {
    item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
    const router = useRouter();
    const { addToCart, isAdding } = useCart();
    const { isAuthenticated } = useAuthStore();
    const removeMutation = useRemoveFromWishlist();

    const hasDiscount = item.discountPrice && item.discountPrice < item.price;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            router.push(ROUTES.LOGIN);
            return;
        }

        addToCart(
            { productId: item.productId, quantity: 1 },
            {
                onSuccess: () => {
                    // Auto-remove from wishlist after adding to cart
                    removeMutation.mutate(item.productId);
                },
            }
        );
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeMutation.mutate(item.productId);
    };

    const isRemoving = removeMutation.isPending;
    const isMoving = isAdding;

    return (
        <>
            {/* ==========================================
          MOBILE: Horizontal List Card
          ========================================== */}
            <div className="sm:hidden bg-white rounded-2xl border border-[#E9E1D2] overflow-hidden hover:shadow-md transition-all group">
                <div className="relative p-3">
                    {/* Delete button - Top Right */}
                    <button
                        onClick={handleRemove}
                        disabled={isRemoving}
                        className="absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center  text-stone-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 "
                        aria-label="Remove from wishlist"
                    >
                        {isRemoving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                        )}
                    </button>

                    <Link
                        href={ROUTES.PRODUCT_DETAIL(item.productSlug)}
                        className="flex gap-3"
                    >
                        {/* Image */}
                        <div className="relative w-24 h-24 shrink-0 bg-[#F5F1E8] rounded-xl overflow-hidden">
                            {item.discountPercentage && (
                                <span className="absolute top-1 left-1 z-10 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                    {item.discountPercentage}%
                                </span>
                            )}

                            {!item.inStock && (
                                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-white text-center px-1">
                                        Out of Stock
                                    </span>
                                </div>
                            )}

                            {item.productImage ? (
                                <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#6B665D]">
                                    <Package className="w-8 h-8" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between pr-8">
                            <div>
                                {item.brand && (
                                    <div className="text-[10px] font-semibold uppercase text-primary-600 tracking-wider truncate">
                                        {item.brand}
                                    </div>
                                )}

                                <h3 className="text-sm font-bold text-[#0A0A0A] line-clamp-2 leading-tight mt-0.5">
                                    {item.productName}
                                </h3>
                            </div>

                            {/* Price + Add to Cart */}
                            <div className="flex items-end justify-between gap-2 mt-2">
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="text-base font-bold text-red-600 leading-tight">
                                        ₹{item.finalPrice.toLocaleString("en-IN")}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-[11px] text-[#6B665D] line-through leading-tight">
                                            ₹{item.price.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!item.inStock || isMoving || isRemoving}
                                    className="relative z-10 left-[30px] flex items-center justify-center gap-1.5 h-7 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-md shadow-primary-500/20 active:scale-95"
                                >
                                    {isMoving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4" />
                                            {/* <span>Add</span> */}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* ==========================================
          DESKTOP: Grid Card (Same as ProductCardCompact but with Delete)
          ========================================== */}
            <div className="hidden sm:block">
                <Link
                    href={ROUTES.PRODUCT_DETAIL(item.productSlug)}
                    className="block rounded-2xl border border-[#E9E1D2] bg-[#FFFDF8] shadow-sm hover:shadow-md transition-all group overflow-hidden"
                >
                    {/* Image Container */}
                    <div className="relative aspect-[3/2] rounded-2xl bg-[#F5F1E8] overflow-hidden">
                        {/* Discount Badge - Left */}
                        {item.discountPercentage && (
                            <span className="absolute left-2 top-2 z-10 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white">
                                {item.discountPercentage}% OFF
                            </span>
                        )}

                        {/* Delete Button - Right (replaces heart) */}
                        <button
                            onClick={handleRemove}
                            disabled={isRemoving}
                            className="absolute top-2 right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-110 active:scale-95 text-stone-600 hover:text-red-500 hover:bg-white transition-all disabled:opacity-60"
                            aria-label="Remove from wishlist"
                        >
                            {isRemoving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>

                        {/* Out of Stock Overlay */}
                        {!item.inStock && (
                            <div className="absolute inset-0 bg-black/40 z-[5] flex items-center justify-center">
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-red-600">
                                    Out of Stock
                                </span>
                            </div>
                        )}

                        {/* Image */}
                        {item.productImage ? (
                            <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#6B665D]">
                                <Package className="w-12 h-12" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-3">
                        {/* Brand */}
                        <div className="text-[10px] font-semibold uppercase text-[#6B665D] tracking-wider truncate">
                            {item.brand || "Vitakart"}
                        </div>

                        {/* Name */}
                        <div className="mt-1 text-sm font-bold text-[#0A0A0A] line-clamp-1">
                            {item.productName}
                        </div>

                        {/* Rating */}
                        <div className="mt-1.5 flex items-center gap-0.5 text-yellow-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={10} fill="currentColor" />
                            ))}
                            <span className="text-[10px] text-[#6B665D] ml-1">4.7 (1.2k)</span>
                        </div>

                        {/* Price + Add button */}
                        <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-base font-black text-red-600 leading-tight">
                                    ₹{item.finalPrice.toLocaleString("en-IN")}
                                </div>
                                {hasDiscount && (
                                    <div className="text-[10px] text-[#6B665D] line-through leading-tight">
                                        ₹{item.price.toLocaleString("en-IN")}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!item.inStock || isMoving || isRemoving}
                                className="w-8 h-8 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-white flex items-center justify-center transition-all hover:scale-110 flex-shrink-0 disabled:opacity-50"
                                aria-label="Add to cart"
                            >
                                {isMoving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}