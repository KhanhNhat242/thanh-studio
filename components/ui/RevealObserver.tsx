"use client";

import { useEffect } from "react";

/**
 * Gắn class .is-revealed cho mọi phần tử [data-reveal] khi cuộn tới.
 * Theo dõi cả phần tử thêm vào sau (đổi bộ lọc album…) bằng MutationObserver.
 *
 * Phần tử đang thấy trên màn hình có thể bị gắn class trước khi khối của nó kịp hydrate (trang stream theo từng
 * khối) → mọi phần tử [data-reveal] phải có `suppressHydrationWarning`, nếu không React báo className lệch.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observeAll = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    };
    observeAll(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]:not(.is-revealed)")) io.observe(node);
            observeAll(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
