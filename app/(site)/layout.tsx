import { FloatingContact } from "@/components/layout/FloatingContact";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RevealObserver } from "@/components/ui/RevealObserver";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <RevealObserver />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <FloatingContact />
    </>
  );
}
