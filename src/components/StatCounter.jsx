// src/components/StatCounter.jsx
import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import FeatureIcon from "./FeatureIcon";

const DURATION_MS = 1400;

export default function StatCounter({ value, suffix = "", label, icon }) {
  const [ref, isInView] = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);

  return (
    <div className="stat-card" ref={ref}>
      {icon && (
        <div className="stat-card__icon">
          <FeatureIcon name={icon} />
        </div>
      )}
      <div className="stat-card__value">
        {count}
        {suffix}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
