"use client";
import type { ReactNode } from "react";

// A link down the page that still lands right when sections above it change height on the way
// (the legacy "จัดกิจกรรมร่วมกับ" block shrinks once its scroll animation has played).
export function JumpLink({ to, children }: { to: string; children: ReactNode }) {
  const go = (e: React.MouseEvent) => {
    const el = document.getElementById(to);
    if (!el) return;
    e.preventDefault();
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    for (const ms of [700, 1400]) setTimeout(() => {
      if (Math.abs(el.getBoundingClientRect().top - 60) > 4) el.scrollIntoView({ behavior: "auto" });
    }, ms);
  };
  return <a href={`#${to}`} onClick={go}>{children}</a>;
}
