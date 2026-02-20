"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MouseGlow — custom cursor that matches the ecosystem SVG aesthetic.
 *
 * Three layers:
 *   1. Sharp cyan dot   — follows mouse exactly (the "patient" node)
 *   2. Orbital ring     — follows with slight lerp lag, expands on hover
 *   3. Ambient glow     — large radial gradient with heavy lerp lag
 *
 * Desktop-only. Hides on touch devices.
 */
export function MouseGlow() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only on non-touch devices
        if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;

        let raf: number;
        let mx = -1000, my = -1000; // mouse
        let rx = -1000, ry = -1000; // ring (lerped)
        let gx = -1000, gy = -1000; // glow (heavy lerped)
        let ringScale = 1;
        let targetRingScale = 1;
        let isHovering = false;
        let isDown = false;

        const onMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            if (!visible) setVisible(true);
        };

        const onOver = (e: MouseEvent) => {
            const el = e.target as Element;
            isHovering = !!el.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]");
        };

        const onDown = () => { isDown = true; };
        const onUp   = () => { isDown = false; };

        const tick = () => {
            // ── Dot: no lag ─────────────────────────────────────────────────
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mx}px,${my}px)`;
                dotRef.current.style.opacity = isDown ? "0.5" : "1";
            }

            // ── Ring: slight lag + scale lerp ────────────────────────────────
            rx += (mx - rx) * 0.14;
            ry += (my - ry) * 0.14;
            targetRingScale = isDown ? 0.65 : isHovering ? 1.9 : 1;
            ringScale += (targetRingScale - ringScale) * 0.15;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${rx}px,${ry}px) scale(${ringScale.toFixed(3)})`;
                ringRef.current.style.borderColor = isHovering
                    ? "rgba(168,85,247,0.7)"
                    : "rgba(0,217,255,0.5)";
                ringRef.current.style.boxShadow = isHovering
                    ? "0 0 10px rgba(168,85,247,0.35), inset 0 0 8px rgba(168,85,247,0.1)"
                    : "0 0 8px rgba(0,217,255,0.25), inset 0 0 5px rgba(0,217,255,0.06)";
            }

            // ── Glow: heavy lag ──────────────────────────────────────────────
            gx += (mx - gx) * 0.05;
            gy += (my - gy) * 0.05;
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${gx}px,${gy}px)`;
            }

            raf = requestAnimationFrame(tick);
        };

        // Hide system cursor globally
        const styleTag = document.createElement("style");
        styleTag.textContent = "html,body,*{cursor:none!important}";
        document.head.appendChild(styleTag);

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseover", onOver, { passive: true });
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup",   onUp);
        raf = requestAnimationFrame(tick);

        return () => {
            styleTag.remove();
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseover", onOver);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup",   onUp);
            cancelAnimationFrame(raf);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* ── Ambient glow (heavy lag) ─────────────────────────────── */}
            <div
                ref={glowRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 480,
                    height: 480,
                    marginLeft: -240,
                    marginTop: -240,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(0,217,255,0.065) 0%, rgba(168,85,247,0.04) 42%, transparent 68%)",
                    pointerEvents: "none",
                    zIndex: 9990,
                    willChange: "transform",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.7s ease",
                }}
            />

            {/* ── Orbital ring (slight lag) ────────────────────────────── */}
            <div
                ref={ringRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 38,
                    height: 38,
                    marginLeft: -19,
                    marginTop: -19,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,217,255,0.5)",
                    pointerEvents: "none",
                    zIndex: 9998,
                    willChange: "transform",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.4s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                }}
            />

            {/* ── Sharp cursor dot (no lag) ────────────────────────────── */}
            <div
                ref={dotRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    borderRadius: "50%",
                    background: "#00D9FF",
                    boxShadow: "0 0 8px #00D9FF, 0 0 18px rgba(0,217,255,0.6)",
                    pointerEvents: "none",
                    zIndex: 9999,
                    willChange: "transform",
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.3s ease, opacity 0.12s ease",
                }}
            />
        </>
    );
}
