// apps/web/components/account/account-menu-items.ts
import {
  Bell,
  CreditCard,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { LucideIcon } from "lucide-react";

export interface AccountMenuItem {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
  iconBg: string;
  iconColor: string;
}

export const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  {
    icon: Package,
    label: "My Orders",
    desc: "Track and manage your orders",
    href: ROUTES.ORDERS,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    label: "Wishlist",
    desc: "Your saved wellness items",
    href: ROUTES.WISHLIST,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: MapPin,
    label: "Addresses",
    desc: "Manage delivery locations",
    href: ROUTES.ADDRESSES,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: User,
    label: "Profile Details",
    desc: "Edit your personal information",
    href: ROUTES.PROFILE,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    desc: "Manage cards & UPI",
    href: "/account/payments",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Email & SMS preferences",
    href: "/account/notifications",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Lock,
    label: "Security",
    desc: "Password & authentication",
    href: "/account/security",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    desc: "FAQs and contact us",
    href: ROUTES.CONTACT,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];