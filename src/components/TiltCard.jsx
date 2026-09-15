// src/components/TiltCard.jsx
import { useTilt } from "../hooks/useTilt";

/**
 * Polymorphic tilt-on-hover wrapper. `as` lets it render as a plain
 * div (default) or a react-router Link, so it can double as a clickable
 * card without adding an extra wrapping element.
 */
export default function TiltCard(props) {
  const { as, className = "", children, intensity, ...rest } = props;
  const Component = as || "div";
  const { ref, onMouseMove, onMouseLeave } = useTilt(intensity);

  return (
    <Component
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
    </Component>
  );
}
