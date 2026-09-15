// src/hooks/useInView.js
import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, isInView]. Once the referenced element scrolls into
 * view, isInView flips to true and stays true (fires once).
 */
export function useInView(options) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.15, ...options });

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}
