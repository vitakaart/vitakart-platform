// File: packages/types/src/index.ts
// This file has all shared TypeScript types
// Web, Admin and API — sab yahan se import karte hain
// Ek jagah change karo, sab jagah update ho jayega

// Test type — just to check package is working
export interface TestType {
  message: string;
}

// Product type — for product listings, cart, orders
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
}

// User type — for auth, profile, admin
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'customer' | 'seller';
}

// Category type — for product categories
export interface Category {
  id: string;
  name: string;
  slug: string;
}