// src/hooks/useScrolled.js
import { useEffect, useState } from "react";

/**
 * Returns true once the page has scrolled past `threshold` pixels.
 *
 * The listener is passive and the state only flips when it actually crosses
 * the threshold, so scrolling never triggers a render per frame.
 */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold
  );

  useEffect(() => {
    let frame = null;

    const read = () => {
      frame = null;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      // Coalesce bursts of scroll events into one read per frame.
      if (frame === null) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
