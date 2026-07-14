// File: apps/web/app/page.tsx
// Testing all 3 shared packages together:
// types + utils + validators

import type { Product } from "@vitakart/types";
import { formatPrice, formatDate, slugify } from "@vitakart/utils";
import { registerSchema } from "@vitakart/validators";

export default function Home() {
  // Sample product
  const sampleProduct: Product = {
    id: "1",
    name: "Whey Protein 1kg",
    slug: slugify("Whey Protein 1kg"),
    price: 2999,
    description: "High quality protein powder",
  };

  // Testing validator — checking if this data is valid
  const testData = {
    fullName: "Bhabani",
    email: "test@vitakart.com",
    password: "Password123",
    phone: "9876543210",
  };

  // Validate the data
  const result = registerSchema.safeParse(testData);
  const isValid = result.success;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Vitakart Web</h1>

      {/* Product card — testing types + utils */}
      <div className="p-6 border rounded-lg shadow-sm max-w-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {sampleProduct.name}
        </h2>
        <p className="mb-2">
          Price: {formatPrice(sampleProduct.price)}
        </p>
        <p className="mb-2">Slug: {sampleProduct.slug}</p>
        <p className="mb-2">Today: {formatDate(new Date())}</p>
      </div>

      {/* Validator test */}
      <div className="p-6 border rounded-lg shadow-sm max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          Validator Test
        </h2>
        <p>
          Data validation:{" "}
          <span
            className={
              isValid ? "text-green-600 font-bold" : "text-red-600 font-bold"
            }
          >
            {isValid ? "✅ Valid" : "❌ Invalid"}
          </span>
        </p>
      </div>
    </div>
  );
}