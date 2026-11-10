import { locationFilters, type LocationFilter } from "@/data/locations";

interface FilterTabsProps {
  value: LocationFilter;
  onChange: (value: LocationFilter) => void;
}

/** Bộ lọc bối cảnh kiểu mục lục tạp chí: chữ + gạch chân champagne cho mục đang chọn. */
export function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Lọc theo bối cảnh"
      className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:gap-4 sm:px-0"
    >
      {locationFilters.map((f) => {
        const active = value === f.key;
        return (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.key)}
            className={`relative min-h-12 shrink-0 px-3 text-[15px] transition-colors duration-300 ${
              active ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {f.label}
            <span
              aria-hidden
              className={`absolute inset-x-3 -bottom-px h-0.5 origin-left bg-champagne-deep transition-transform duration-500 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
