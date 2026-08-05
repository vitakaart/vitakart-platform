// Smart Razorpay script loader
// Loads script only when needed, caches after first load

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const LOAD_TIMEOUT_MS = 15000;

// Cache the load promise so concurrent calls don't create duplicate scripts
let loadPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  // Already loaded — return immediately
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve(true);
  }

  // Currently loading — reuse existing promise
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<boolean>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Cannot load Razorpay on server"));
      return;
    }

    // Check if script tag already exists in DOM
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => {
        loadPromise = null;
        reject(new Error("Razorpay script failed to load"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    const timeoutId = setTimeout(() => {
      loadPromise = null;
      script.remove();
      reject(
        new Error(
          "Payment gateway is taking too long to load. Please check your internet connection."
        )
      );
    }, LOAD_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timeoutId);

      if (window.Razorpay) {
        resolve(true);
      } else {
        loadPromise = null;
        reject(new Error("Razorpay loaded but not initialized properly"));
      }
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      loadPromise = null;
      script.remove();
      reject(
        new Error("Failed to load payment gateway. Please check your internet.")
      );
    };

    document.body.appendChild(script);
  });

  return loadPromise;
}

export function isRazorpayLoaded(): boolean {
  return typeof window !== "undefined" && !!window.Razorpay;
}