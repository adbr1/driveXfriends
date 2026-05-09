"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => {
      document.documentElement.classList.toggle("is-touch", mql.matches);
      setIsTouch(mql.matches);
    };
    update();
    mql.addEventListener("change", update);
    return () => {
      mql.removeEventListener("change", update);
      document.documentElement.classList.remove("is-touch");
    };
  }, []);
  return isTouch;
}

export function usePrefersColorScheme(): "light" | "dark" {
  return "dark";
}

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
