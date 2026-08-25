// File: apps/web/lib/hooks/use-categories.ts

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";

export function useTopLevelCategories() {
  return useQuery({
    queryKey: ["categories", "top-level"],
    queryFn: categoriesApi.getTopLevel,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: categoriesApi.getTree,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}