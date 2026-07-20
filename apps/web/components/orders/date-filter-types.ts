// File: apps/web/components/orders/date-filter-types.ts
// Date filter options + helpers

export type DateFilterId =
  | "all"
  | "30days"
  | "3months"
  | "6months"
  | "year2024"
  | "year2023";

export interface DateFilter {
  id: DateFilterId;
  label: string;
  getRange: () => { fromDate?: string; toDate?: string };
}

export const DATE_FILTERS: DateFilter[] = [
  {
    id: "all",
    label: "All time",
    getRange: () => ({}),
  },
  {
    id: "30days",
    label: "Last 30 days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 30);
      return {
        fromDate: from.toISOString(),
        toDate: to.toISOString(),
      };
    },
  },
  {
    id: "3months",
    label: "Last 3 months",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 3);
      return {
        fromDate: from.toISOString(),
        toDate: to.toISOString(),
      };
    },
  },
  {
    id: "6months",
    label: "Last 6 months",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 6);
      return {
        fromDate: from.toISOString(),
        toDate: to.toISOString(),
      };
    },
  },
  {
    id: "year2024",
    label: "2024",
    getRange: () => ({
      fromDate: new Date("2024-01-01").toISOString(),
      toDate: new Date("2024-12-31").toISOString(),
    }),
  },
  {
    id: "year2023",
    label: "2023",
    getRange: () => ({
      fromDate: new Date("2023-01-01").toISOString(),
      toDate: new Date("2023-12-31").toISOString(),
    }),
  },
];