// src/components/Reveal.jsx
import { useInView } from "../hooks/useInView";

/**
 * Fades/slides children in once they scroll into view.
 * Usage: <Reveal><div className="some-grid">...</div></Reveal>
 */
export default function Reveal({ children, className = "", delay = 0 }) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? "reveal--visible" : ""} ${className}`}
      // Offsets the whole stagger, so one section can cascade in after
      // another. globals.css adds this to each child's own delay.
      style={delay ? { "--gs-reveal-delay": `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
