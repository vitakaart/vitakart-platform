// File: apps/web/components/addresses/form/or-divider.tsx
// "Or fill manually" divider

export function OrDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-stone-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs text-stone-500 font-medium uppercase tracking-wide">
          Or fill manually
        </span>
      </div>
    </div>
  );
}