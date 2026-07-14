"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function refreshAos() {
  if (typeof window === "undefined") return;

  const run = () => {
    const aos = window.AOS;

    if (!aos) {
      document.documentElement.classList.add("aos-ready");
      return;
    }

    aos.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    if (typeof aos.refreshHard === "function") {
      aos.refreshHard();
    } else if (typeof aos.refresh === "function") {
      aos.refresh();
    }

    document.documentElement.classList.add("aos-ready");
  };

  document.documentElement.classList.remove("aos-ready");
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}

export default function AosController() {
  const pathname = usePathname();

  useEffect(() => {
    refreshAos();

    const onLoad = () => refreshAos();
    window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return null;
}
