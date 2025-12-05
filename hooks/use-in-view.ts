"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Custom hook to detect when an element enters the viewport
 * Uses Intersection Observer API for performance
 * 
 * @param options - Configuration options
 * @returns { ref, isInView } - Ref to attach to element and visibility state
 */
export function useInView<T extends HTMLElement = HTMLElement>(
    options: UseInViewOptions = {}
) {
    const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<T>(null);
    const hasTriggered = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Skip if already triggered and triggerOnce is true
        if (triggerOnce && hasTriggered.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    hasTriggered.current = true;

                    // Unobserve if triggerOnce
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsInView(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isInView };
}
