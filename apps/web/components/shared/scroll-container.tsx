// File: apps/web/components/shared/scroll-container.tsx
// Reusable horizontal scroll container

import { cn } from "@/lib/utils";

interface ScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
  return (
    <div className={cn(
      "flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory",
      className
    )}>
      {children}
    </div>
  );
}