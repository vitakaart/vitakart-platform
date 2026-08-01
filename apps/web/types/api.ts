// File: apps/web/types/api.ts
// TypeScript types for API responses

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

// Validation error format
export interface ValidationError {
  message: string;
  statusCode: 400;
  errors: Record<string, string[]>;
  timestamp: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// User info from auth
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  
  profileImage?: string | null;
  role: "Customer" | "Vendor" | "Admin" | "SuperAdmin";
  isVerified: boolean;
}

// Auth response (login/register)
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Register DTO
export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

// Login DTO
export interface LoginInput {
  email: string;
  password: string;
}

// Category
export interface Category {
  id: string;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  subCategoriesCount: number;
  createdAt: string;
  updatedAt: string | null;
}

// Category tree (nested)
export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  children: CategoryTree[];
}

// Product
export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  price: number;
  discountPrice: number | null;
  finalPrice: number;
  discountPercentage: number | null;
  imageUrl: string | null;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string | null;
}

// Product query params
export interface ProductQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  sortBy?: "name" | "price" | "newest" | "oldest";
  sortOrder?: "asc" | "desc";
}

// ==========================================
// CART TYPES
// ==========================================

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  brand: string | null;
  quantity: number;
  unitPrice: number;
  discountPrice: number | null;
  effectivePrice: number;
  totalPrice: number;
  savedAmount: number;
  availableStock: number;
  inStock: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  couponCode: string | null;
  couponDiscount: number;
  items: CartItem[];
  totalItems: number;
  uniqueItemsCount: number;
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

// ==========================================
// ORDER TYPES
// ==========================================

export enum OrderStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
  Returned = "Returned",
  Refunded = "Refunded",
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
}

export enum PaymentMethod {
  COD = "COD",
  Razorpay = "Razorpay",
  UPI = "UPI",
  Card = "Card",
  NetBanking = "NetBanking",
  Wallet = "Wallet",
}

// Order item
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  productBrand: string | null;
  productSku: string | null;
  quantity: number;
  unitPrice: number;
  discountPrice: number | null;
  effectivePrice: number;
  totalPrice: number;
  savedAmount: number;
}

// Full order (detail view)
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;

  // Pricing
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  taxAmount: number;
  couponDiscount: number;
  total: number;
  couponCode: string | null;

  // Shipping address (snapshot)
  shippingFullName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingLandmark: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingCountry: string;

  customerNotes: string | null;

  // Timestamps
  createdAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  // Items
  items: OrderItem[];
}

// Lightweight order (list view)
export interface OrderListItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  totalItems: number;
  createdAt: string;
}

// Paginated orders response
export interface PaginatedOrders {
  orders: OrderListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Create order input
export interface CreateOrderInput {
  paymentMethod: PaymentMethod;
  couponCode?: string;
  idempotencyKey?: string;
  customerNotes?: string;

  // Shipping address
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

// Cancel order input
export interface CancelOrderInput {
  reason?: string;
}

// ==========================================
// UPDATE PROFILE TYPES
// ==========================================

// Update profile DTO
export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
  profileImage?: string;
}

// Profile updated response
export interface ProfileUpdatedResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: "Customer" | "Vendor" | "Admin" | "SuperAdmin";
  isVerified: boolean;
}

// ==========================================
// ADDRESS TYPES
// ==========================================

export enum AddressType {
  Home = "Home",
  Office = "Office",
  Other = "Other",
}

// Address (from API)
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: AddressType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Create address input
export interface CreateAddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type: AddressType;
  isDefault?: boolean;
}

// Update address input
export interface UpdateAddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  type: AddressType;
}

// ==========================================
// WISHLIST TYPES
// ==========================================

// Wishlist item (from API)
export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  brand: string | null;
  categoryName: string;
  categorySlug: string;
  price: number;
  discountPrice: number | null;
  finalPrice: number;
  discountPercentage: number | null;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  addedAt: string;
}

// Toggle response
export interface WishlistToggleResponse {
  isInWishlist: boolean;
  message: string;
  wishlistCount: number;
}

// Count response
export interface WishlistCountResponse {
  count: number;
}

// Add/Toggle input
export interface WishlistActionInput {
  productId: string;
}

// ==========================================
// REVIEWS & RATINGS TYPES
// ==========================================

// Single review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userInitial: string;
  rating: number;
  title: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string | null;
}

// Product review stats
export interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<number, number>;
  ratingPercentage: Record<number, number>;
}

// Paginated reviews
export interface PaginatedReviews {
  reviews: Review[];
  stats: ProductReviewStats;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Eligibility check
export interface ReviewEligibility {
  canReview: boolean;
  hasReviewed: boolean;
  hasPurchased: boolean;
  reason: string | null;
  existingReview: Review | null;
}

// Create review input
export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

// Update review input
export interface UpdateReviewInput {
  rating: number;
  title?: string;
  comment: string;
}

// Query params
export interface ReviewQueryParams {
  page?: number;
  pageSize?: number;
  rating?: number;
}

// ==========================================
// PASSWORD RESET TYPES
// ==========================================

// Forgot password input
export interface ForgotPasswordInput {
  email: string;
}

// Forgot password response
export interface ForgotPasswordResponse {
  message: string;
  // DEV ONLY (remove when email is set up)
  resetToken?: string;
  resetUrl?: string;
}

// Reset password input
export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

// ==========================================
// COUPON TYPES
// ==========================================

// Coupon type enum
export type CouponDiscountType = "Percentage" | "Fixed";

// Public coupon info
export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: CouponDiscountType;
  value: number;
  maxDiscount: number | null;
  minOrderAmount: number;
  validUntil: string | null;
  displayText: string; // "10% OFF up to ₹100"
  conditionText: string; // "Min order ₹500 • Expires 15 Dec"

  // User usage info
  userUsageCount: number;
  perUserLimit: number | null;
  isUsedByUser: boolean;
  canUseAgain: boolean;
}

// Validation result
export interface CouponValidation {
  isValid: boolean;
  message: string;
  discountAmount: number;
  coupon: Coupon | null;
}

// Apply coupon input
export interface ApplyCouponInput {
  code: string;
}

// ==========================================
// IMAGE UPLOAD TYPES
// ==========================================

export interface ImageUploadResponse {
  success: boolean;
  publicId: string | null;
  url: string | null;
  secureUrl: string | null;
  width: number;
  height: number;
  format: string | null;
  bytes: number;
  errorMessage: string | null;
}
