"use client";

import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function AnimatedStat({ stat, delay }: { stat: { value: string; suffix: string; label: string; }; delay: number }) {
  const [ref, isInView] = useScrollReveal<HTMLDivElement>({ margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(stat.value);
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, stat.value]);

  return (
    <div
      ref={ref}
      className={`text-center reveal ${isInView ? "visible" : ""}`}
      style={{ transitionDelay: `${delay * 0.1}s` }}
    >
      <p className="stat-number text-5xl md:text-6xl">
        {count}<span className="text-white/20">{stat.suffix}</span>
      </p>
      <p className="text-white/35 text-sm mt-3">{stat.label}</p>
    </div>
  );
}
