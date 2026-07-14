// File: packages/validators/src/index.ts
// All validation schemas using Zod
// These check if user input is correct before saving to DB

import { z } from "zod";

// ============================================
// AUTH VALIDATORS
// ============================================

// For user registration form
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"),
});

// For login form
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// ============================================
// PRODUCT VALIDATORS
// ============================================

// For adding new product (admin)
export const productSchema = z.object({
  name: z.string().min(2, "Product name required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().uuid("Invalid category"),
});

// ============================================
// ADDRESS VALIDATORS
// ============================================

// For add/edit address form
export const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid phone required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid pincode required"),
  country: z.string().default("India"),
});

// ============================================
// TYPE EXPORTS
// ============================================
// These types are auto-generated from schemas
// Use these in your forms and API calls

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type AddressInput = z.infer<typeof addressSchema>;