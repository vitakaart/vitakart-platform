// File: apps/web/components/layout/navbar/announcement-bar.tsx
// Top announcement bar with offers/promotions

export function AnnouncementBar() {
  return (
    <div className="bg-primary-600 text-white text-center py-2 px-4 text-xs md:text-sm">
      🎉 Free shipping on orders above ₹499 | Use code:{" "}
      <span className="font-bold">HEALTH10</span>
    </div>
  );
}