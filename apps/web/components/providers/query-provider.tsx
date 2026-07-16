// File: apps/web/components/providers/query-provider.tsx
// React Query provider for data fetching + caching

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data considered fresh for 1 minute
            staleTime: 60 * 1000,

            // Cache kept for 5 minutes after unmount
            gcTime: 5 * 60 * 1000,

            // Retry failed requests once
            retry: 1,

            // Don't refetch on window focus (annoying in dev)
            refetchOnWindowFocus: false,

            // Refetch when reconnecting to internet
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}