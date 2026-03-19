"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Lightweight IntersectionObserver hook that replaces Framer Motion's whileInView.
 * Returns a ref and a boolean. Attach the ref to the element you want to animate
 * and use the boolean to toggle a CSS class (e.g. "visible").
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
    options: { once?: boolean; margin?: string } = {}
): [React.RefCallback<T>, boolean] {
    const { once = true, margin = "-80px" } = options;
    const elRef = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
        };
    }, []);

    const refCallback: React.RefCallback<T> = (node) => {
        // Cleanup previous observer
        observerRef.current?.disconnect();
        elRef.current = node;

        if (!node) return;

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observerRef.current?.unobserve(node);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { rootMargin: margin, threshold: 0.01 }
        );

        observerRef.current.observe(node);
    };

    return [refCallback, isVisible];
}
