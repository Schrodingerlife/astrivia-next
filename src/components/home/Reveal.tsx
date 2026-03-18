"use client";

import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Reveal({
  children,
  className = "",
  direction,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  delay?: 1 | 2 | 3 | 4;
}) {
  const [ref, isVisible] = useScrollReveal();
  const baseClass = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : "reveal";
  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    <div ref={ref} className={`${baseClass} ${delayClass} ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
