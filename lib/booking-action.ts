"use server";

import {
  readBookingForm,
  validateBooking,
  type BookingState,
} from "@/lib/booking";

/** Server Action nhận yêu cầu đặt lịch tư vấn / giữ chỗ (F4). */
export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const input = readBookingForm(formData);
  const errors = validateBooking(input);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Vui lòng kiểm tra lại các thông tin được đánh dấu.",
      errors,
      values: input,
    };
  }

  // TODO(content): lưu lịch đặt vào DB cho trang quản trị (F8) và gửi thông báo
  // cho studio (email thanhstudio121dn@gmail.com / Zalo) — [CẦN XÁC NHẬN] kênh nhận.

  return {
    status: "success",
    message:
      "Cảm ơn đôi bạn! Thanh Studio đã nhận thông tin và sẽ liên hệ tư vấn sớm nhất.",
  };
}
