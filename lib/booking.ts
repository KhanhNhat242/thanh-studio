import { bookingPackageOptions } from "@/data/packages";

/** Validate dùng chung client + server cho form đặt lịch (F4). */

export const PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

export const areaOptions = [
  { value: "hue", label: "Huế" },
  { value: "da-nang", label: "Đà Nẵng" },
] as const;

export interface BookingInput {
  name: string;
  phone: string;
  weddingDate: string;
  packageId: string;
  area: string;
  note: string;
}

export type BookingField = keyof BookingInput;
export type BookingErrors = Partial<Record<BookingField, string>>;

export interface BookingState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: BookingErrors;
  values?: Partial<BookingInput>;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s.\-()]/g, "");
}

export function readBookingForm(form: FormData): BookingInput {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  return {
    name: get("name"),
    phone: get("phone"),
    weddingDate: get("weddingDate"),
    packageId: get("packageId"),
    area: get("area"),
    note: get("note"),
  };
}

function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function validateBooking(input: BookingInput): BookingErrors {
  const errors: BookingErrors = {};

  if (input.name.length > 80) errors.name = "Họ tên tối đa 80 ký tự.";

  if (!input.phone) errors.phone = "Vui lòng nhập số điện thoại.";
  else if (!PHONE_REGEX.test(normalizePhone(input.phone)))
    errors.phone = "Số điện thoại chưa đúng, ví dụ: 0905 661 736.";

  if (!input.weddingDate) errors.weddingDate = "Vui lòng chọn ngày cưới dự kiến.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.weddingDate))
    errors.weddingDate = "Ngày cưới chưa hợp lệ.";
  else if (input.weddingDate < todayISO())
    errors.weddingDate = "Ngày cưới cần từ hôm nay trở đi.";

  if (!input.packageId) errors.packageId = "Vui lòng chọn gói quan tâm.";
  else if (!bookingPackageOptions.some((o) => o.value === input.packageId))
    errors.packageId = "Gói dịch vụ không hợp lệ.";

  if (input.area && !areaOptions.some((o) => o.value === input.area))
    errors.area = "Khu vực không hợp lệ.";

  if (input.note.length > 500) errors.note = "Ghi chú tối đa 500 ký tự.";

  return errors;
}
