// File: apps/web/components/addresses/form/pincode-field.tsx
// FIX: Track last fetched pincode to prevent re-fetching

"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";  // ← ADD useRef
import { toast } from "sonner";
import { FormField } from "./form-field";
import { getPincodeDetails } from "@/lib/utils/location";

interface PincodeFieldProps {
  value: string;
  error?: string;
  originalValue?: string;
  onDetailsFound: (city: string, state: string) => void;
  register: any;
}

export function PincodeField({
  value,
  error,
  originalValue,
  onDetailsFound,
  register,
}: PincodeFieldProps) {
  const [fetching, setFetching] = useState(false);
  
  // ✅ Track last fetched pincode — prevents re-fetching same value
  const lastFetchedRef = useRef<string>("");

  useEffect(() => {
    // Only fetch if pincode is exactly 6 digits
    if (!/^\d{6}$/.test(value)) return;

    // Skip if editing and pincode hasn't changed
    if (originalValue && originalValue === value) return;

    // ✅ Skip if we already fetched this exact pincode
    if (lastFetchedRef.current === value) return;

    const fetchDetails = async () => {
      setFetching(true);
      try {
        const details = await getPincodeDetails(value);
        
        // ✅ Mark as fetched BEFORE calling callback
        lastFetchedRef.current = value;
        
        onDetailsFound(details.city, details.state);
        toast.success(`Found: ${details.city}, ${details.state}`);
      } catch (error) {
        console.error("Pincode fetch failed:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();
  }, [value, originalValue, onDetailsFound]);

  return (
    <FormField
      label="Pincode"
      required
      placeholder="400001"
      maxLength={6}
      error={error}
      hint="💡 City & State will auto-fill from pincode"
      rightElement={
        fetching ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
        ) : null
      }
      {...register}
    />
  );
}