"use client";

import type { ReactNode } from "react";

export const SELECT_PACKAGE_EVENT = "thanh:select-package";

/** Cuộn tới form đặt lịch (F4) và chọn sẵn gói tương ứng. */
export function SelectPackageLink({
  packageId,
  className,
  children,
}: {
  packageId: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#dat-lich"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_PACKAGE_EVENT, { detail: packageId }));
      }}
    >
      {children}
    </a>
  );
}
