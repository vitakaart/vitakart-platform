// File: packages/utils/src/index.ts
// All helper functions live here
// Web, Admin, API — sab yahan se import karte hain

// Format price with Indian Rupee symbol
// Example: formatPrice(2999) → "₹2,999"
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to readable format
// Example: formatDate(new Date()) → "15 Jul 2026"
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Convert text to URL-friendly slug
// Example: slugify("Whey Protein 1kg") → "whey-protein-1kg"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Truncate text with dots
// Example: truncate("Hello World", 5) → "Hello..."
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Generate random string (for IDs, tokens, etc.)
// Example: generateId(8) → "a3f9k2m1"
export function generateId(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}