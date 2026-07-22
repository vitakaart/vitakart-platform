// File: apps/web/components/addresses/form/location-detector.tsx
// "Use Current Location" button with API call

"use client";

import { Loader2, Navigation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getAddressFromCurrentLocation,
  type LocationDetails,
} from "@/lib/utils/location";

interface LocationDetectorProps {
  onLocationDetected: (location: LocationDetails) => void;
}

export function LocationDetector({ onLocationDetected }: LocationDetectorProps) {
  const [detecting, setDetecting] = useState(false);

  const handleDetect = async () => {
    setDetecting(true);
    const toastId = toast.loading("Detecting your location...");

    try {
      const location = await getAddressFromCurrentLocation();
      onLocationDetected(location);
      toast.success("Location detected! Please verify the details.", {
        id: toastId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to detect location";
      toast.error(message, { id: toastId });
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-200 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0">
          <Navigation className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900 text-sm">
            Fill Automatically
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Use your current location to auto-fill the address
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleDetect}
        disabled={detecting}
        className="w-full h-10 bg-primary-500 hover:bg-primary-600 text-white"
      >
        {detecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Detecting Location...
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4 mr-2" />
            Use Current Location
          </>
        )}
      </Button>

      <p className="text-[11px] text-stone-500 text-center mt-2">
        🔒 Location used only for filling this form
      </p>
    </div>
  );
}