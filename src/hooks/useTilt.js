// src/hooks/useTilt.js
import { useCallback, useRef } from "react";

/**
 * Subtle mouse-tracked 3D tilt. Returns handlers to spread onto the
 * element you want tilted; the transform is set directly (inline)
 * on mousemove and cleared on mouseleave.
 */
export function useTilt(intensity = 8) {
  const ref = useRef(null);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(700px) rotateX(${(-y * intensity).toFixed(2)}deg) rotateY(${(x * intensity).toFixed(2)}deg) translateY(-4px)`;
    },
    [intensity]
  );

  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
