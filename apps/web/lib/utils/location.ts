// File: apps/web/lib/utils/location.ts
// Location & geocoding helpers — all FREE APIs

// ==========================================
// TYPES
// ==========================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetails {
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface PincodeDetails {
  city: string;
  state: string;
  district: string;
  country: string;
}

// ==========================================
// 1. GET CURRENT LOCATION (Browser API)
// ==========================================

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out. Please try again.";
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// ==========================================
// 2. REVERSE GEOCODE (OpenStreetMap - FREE)
// ==========================================

export async function reverseGeocode(
  coords: Coordinates
): Promise<LocationDetails> {
  const { latitude, longitude } = coords;
  
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`;

  try {
    const response = await fetch(url, {
      headers: {
        // Nominatim requires User-Agent
        "Accept-Language": "en",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch address");
    }

    const data = await response.json();
    
    if (!data || !data.address) {
      throw new Error("No address found for this location");
    }

    const addr = data.address;

    // Build address line 1 from house_number + road
    const line1Parts = [
      addr.house_number,
      addr.building,
      addr.road,
    ].filter(Boolean);

    // Build address line 2 from neighbourhood/suburb
    const line2Parts = [
      addr.neighbourhood,
      addr.suburb,
      addr.residential,
    ].filter(Boolean);

    return {
      addressLine1: line1Parts.join(", ") || "",
      addressLine2: line2Parts.join(", ") || "",
      landmark: addr.amenity || "",
      city:
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        "",
      state: addr.state || "",
      pincode: addr.postcode || "",
      country: addr.country || "India",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch address details");
  }
}

// ==========================================
// 3. GET PINCODE DETAILS (India Post - FREE)
// ==========================================

export async function getPincodeDetails(
  pincode: string
): Promise<PincodeDetails> {
  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    throw new Error("Invalid pincode format");
  }

  const url = `https://api.postalpincode.in/pincode/${pincode}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch pincode details");
    }

    const data = await response.json();

    if (!data || !data[0] || data[0].Status !== "Success") {
      throw new Error("Invalid pincode or no data found");
    }

    const postOffice = data[0].PostOffice?.[0];

    if (!postOffice) {
      throw new Error("No details found for this pincode");
    }

    return {
      city: postOffice.District || postOffice.Block || "",
      state: postOffice.State || "",
      district: postOffice.District || "",
      country: postOffice.Country || "India",
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch pincode details");
  }
}

// ==========================================
// 4. COMBINED HELPER — Get Full Address from Location
// ==========================================

export async function getAddressFromCurrentLocation(): Promise<LocationDetails> {
  // Step 1: Get coordinates
  const coords = await getCurrentLocation();

  // Step 2: Reverse geocode
  const address = await reverseGeocode(coords);

  return address;
}