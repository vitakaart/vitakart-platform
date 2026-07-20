// File: apps/web/components/orders/orders-filter-tabs.tsx

"use client";

import { Calendar } from "lucide-react";
import { OrderStatus } from "@/types/api";
import { DATE_FILTERS, DateFilterId } from "./date-filter-types";
import { SortDropdown } from "@/components/shared/sort-dropdown";
import { cn } from "@/lib/utils";

interface Props {
  dateFilter: DateFilterId;
  statusFilter: OrderStatus | null;
  onDateChange: (id: DateFilterId) => void;
  onStatusChange: (status: OrderStatus | null) => void;
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: OrderStatus.Pending },
  { label: "Confirmed", value: OrderStatus.Confirmed },
  { label: "Processing", value: OrderStatus.Processing },
  { label: "Shipped", value: OrderStatus.Shipped },
  { label: "Delivered", value: OrderStatus.Delivered },
  { label: "Cancelled", value: OrderStatus.Cancelled },
];

const DATE_OPTIONS = DATE_FILTERS.map((f) => ({
  label: f.label,
  value: f.id,
}));

export function OrdersFilterTabs({
  dateFilter,
  statusFilter,
  onDateChange,
  onStatusChange,
}: Props) {
  return (
    <>
      {/* MOBILE: Two full-width dropdowns */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        <SortDropdown
          label="Time"
          options={DATE_OPTIONS}
          value={dateFilter}
          onChange={(value) => onDateChange(value as DateFilterId)}
          fullWidth
        />
        <SortDropdown
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter ?? "all"}
          onChange={(value) => {
            onStatusChange(value === "all" ? null : (value as OrderStatus));
          }}
          fullWidth
        />
      </div>

      {/* DESKTOP: Date tabs + Status dropdown */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 pb-0.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 shrink-0 pr-1">
            <Calendar className="w-3 h-3" />
          </div>

          {DATE_FILTERS.map((filter) => {
            const isActive = dateFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onDateChange(filter.id)}
                className={cn(
                  "shrink-0 h-9 px-3.5 rounded-full text-xs font-medium border transition-all active:scale-95",
                  isActive
                    ? "bg-[#10B981] text-white border-[#10B981]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="shrink-0">
          <SortDropdown
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter ?? "all"}
            onChange={(value) => {
              onStatusChange(value === "all" ? null : (value as OrderStatus));
            }}
          />
        </div>
      </div>
    </>
  );
}