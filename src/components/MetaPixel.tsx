"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { trackPageView } from "@/lib/meta-pixel";

function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // First PageView already fired by the base pixel script in <head>
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelPageView />
    </Suspense>
  );
}
