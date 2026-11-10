"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/ButtonLink";
import { CheckIcon, ZaloIcon } from "@/components/ui/Icons";
import { SELECT_PACKAGE_EVENT } from "@/components/ui/SelectPackageLink";
import { bookingPackageOptions } from "@/data/packages";
import { submitBooking } from "@/lib/booking-action";
import {
  areaOptions,
  readBookingForm,
  validateBooking,
  type BookingErrors,
  type BookingState,
} from "@/lib/booking";
import { siteConfig } from "@/lib/site-config";

const initialState: BookingState = { status: "idle" };

/** Ô nhập cao 48px; viền muted (≥ 3:1 trên nền ngà), focus: viền champagne đậm + vòng sáng rõ */
const fieldClass = (error?: string) =>
  `mt-2 block h-12 w-full border bg-ivory px-4 text-[16px] text-ink transition-[border-color,box-shadow] outline-none placeholder:text-muted focus:border-champagne-deep focus:ring-2 focus:ring-champagne/60 ${
    error ? "border-error" : "border-muted/70"
  }`;

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between gap-3 text-[15px] font-medium text-ink"
    >
      <span>{children}</span>
      {required && (
        <span className="text-[13px] text-champagne-deep">
          Bắt buộc
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-error">
      {message}
    </p>
  );
}

export function BookingForm() {
  const [state, formAction, pending] = useActionState(submitBooking, initialState);
  const [clientErrors, setClientErrors] = useState<BookingErrors>({});
  const [packageId, setPackageId] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [dismissed, setDismissed] = useState<BookingState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = { ...state.errors, ...clientErrors };

  useEffect(() => {
    // Ngày nhỏ nhất = hôm nay (đặt trực tiếp lên DOM để tránh lệch giờ server/client)
    const d = new Date();
    if (dateRef.current) {
      dateRef.current.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    const onSelect = (e: Event) => {
      setPackageId((e as CustomEvent<string>).detail);
      setClientErrors((prev) => ({ ...prev, packageId: undefined }));
    };
    window.addEventListener(SELECT_PACKAGE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelect);
  }, [formKey]);

  if (state.status === "success" && state !== dismissed) {
    return (
      <div className="flex flex-col items-center py-10 text-center" role="status">
        <span className="grid size-16 place-items-center rounded-full border border-champagne-deep text-champagne-deep">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-6 font-serif text-[32px] leading-tight font-light">Đã nhận lịch hẹn</h3>
        <p className="mt-3 max-w-[380px] text-[16px] leading-[1.7] text-ink/85">{state.message}</p>
        <a
          href={siteConfig.links.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("primary", "mt-8")}
        >
          <ZaloIcon className="size-5" />
          Nhắn Zalo cho nhanh
        </a>
        <button
          type="button"
          onClick={() => {
            setDismissed(state);
            setPackageId("");
            setFormKey((k) => k + 1);
          }}
          className="mt-5 min-h-11 text-[13px] tracking-[0.1em] text-muted underline underline-offset-4 hover:text-ink"
        >
          Gửi thêm một yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form
      key={formKey}
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={(e) => {
        const errs = validateBooking(readBookingForm(new FormData(e.currentTarget)));
        setClientErrors(errs);
        if (Object.keys(errs).length > 0) {
          e.preventDefault();
          const first = Object.keys(errs)[0];
          formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        }
      }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="bk-name">Họ và tên</Label>
        <input
          id="bk-name"
          name="name"
          autoComplete="name"
          placeholder="Tên của đôi bạn"
          defaultValue={state.values?.name}
          className={fieldClass(errors.name)}
        />
        <FieldError id="bk-name-err" message={errors.name} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="bk-phone" required>
            Số điện thoại
          </Label>
          <input
            id="bk-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0905 xxx xxx"
            required
            defaultValue={state.values?.phone}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "bk-phone-err" : undefined}
            className={fieldClass(errors.phone)}
          />
          <FieldError id="bk-phone-err" message={errors.phone} />
        </div>
        <div>
          <Label htmlFor="bk-date" required>
            Ngày cưới dự kiến
          </Label>
          <input
            id="bk-date"
            name="weddingDate"
            type="date"
            required
            ref={dateRef}
            defaultValue={state.values?.weddingDate}
            aria-invalid={!!errors.weddingDate}
            aria-describedby={errors.weddingDate ? "bk-date-err" : undefined}
            className={fieldClass(errors.weddingDate)}
          />
          <FieldError id="bk-date-err" message={errors.weddingDate} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="bk-package" required>
            Gói quan tâm
          </Label>
          <select
            id="bk-package"
            name="packageId"
            required
            value={packageId || state.values?.packageId || ""}
            onChange={(e) => setPackageId(e.target.value)}
            aria-invalid={!!errors.packageId}
            aria-describedby={errors.packageId ? "bk-package-err" : undefined}
            className={`${fieldClass(errors.packageId)} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238c6a3f%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Chọn gói
            </option>
            {bookingPackageOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <FieldError id="bk-package-err" message={errors.packageId} />
        </div>
        <fieldset>
          <legend className="text-[15px] font-medium text-ink">
            Khu vực
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {areaOptions.map((o) => (
              <label key={o.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="area"
                  value={o.value}
                  defaultChecked={state.values?.area === o.value}
                  className="peer sr-only"
                />
                <span className="flex h-12 items-center justify-center border border-muted/70 bg-ivory text-[15px] text-ink transition-colors peer-checked:border-champagne-deep peer-checked:bg-blush peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne-deep">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <Label htmlFor="bk-note">Ghi chú</Label>
        <textarea
          id="bk-note"
          name="note"
          rows={3}
          placeholder="Bối cảnh mong muốn, số lượng trang phục, câu hỏi khác…"
          defaultValue={state.values?.note}
          className={`${fieldClass(errors.note)} h-auto min-h-24 resize-none py-3`}
        />
        <FieldError id="bk-note-err" message={errors.note} />
      </div>

      {state.status === "error" && Object.keys(clientErrors).length === 0 && (
        <p role="alert" className="text-[14px] text-error">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "w-full disabled:cursor-wait disabled:opacity-70")}
      >
        {pending ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
      </button>

      <p className="text-center text-[14px] text-muted">
        Hoặc{" "}
        <a
          href={siteConfig.links.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-champagne-deep underline decoration-champagne/50 underline-offset-4 hover:text-ink"
        >
          nhắn Zalo ngay ({siteConfig.phoneDisplay})
        </a>
      </p>
    </form>
  );
}
