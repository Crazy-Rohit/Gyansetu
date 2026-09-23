// src/components/FunFactsFloater.jsx
//
// The "magic circle" — a playful, draggable launcher that lives on every
// page (mounted once in MainLayout, next to the ChatBot). It starts docked
// at the bottom center of the viewport but can be dragged anywhere and
// stays put across reloads. A tap/click that doesn't move it plays a quick
// magic-burst animation and sends you straight to the Fun Facts page.
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { funFacts } from "../data/funFactsData";
import "./funFactsFloater.css";

const POS_KEY = "gs_fun_facts_pos";
const BUTTON_SIZE = 60;
const DRAG_THRESHOLD = 6; // px of pointer movement before a press counts as a drag, not a click
const SPLASH_MS = 380; // how long the burst plays before the page actually changes

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampToViewport(pos) {
  const maxX = Math.max(8, window.innerWidth - BUTTON_SIZE - 8);
  const maxY = Math.max(8, window.innerHeight - BUTTON_SIZE - 8);
  return { x: clamp(pos.x, 8, maxX), y: clamp(pos.y, 8, maxY) };
}

function defaultPosition() {
  return clampToViewport({
    x: window.innerWidth / 2 - BUTTON_SIZE / 2,
    y: window.innerHeight - BUTTON_SIZE - 24,
  });
}

function readStoredPosition() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x !== "number" || typeof parsed?.y !== "number") return null;
    return clampToViewport(parsed);
  } catch {
    return null;
  }
}

export default function FunFactsFloater() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pos, setPos] = useState(() =>
    typeof window === "undefined" ? { x: 0, y: 0 } : readStoredPosition() || defaultPosition()
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isSplashing, setIsSplashing] = useState(false);

  const dragRef = useRef(null);
  const buttonRef = useRef(null);

  // Keep the floater on-screen across window resizes / orientation changes.
  useEffect(() => {
    const onResize = () => setPos((p) => clampToViewport(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const savePos = useCallback((next) => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode) — position just won't persist
    }
  }, []);

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y, moved: false };
    buttonRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.moved = true;
      setIsDragging(true);
    }
    if (drag.moved) {
      setPos(clampToViewport({ x: drag.originX + dx, y: drag.originY + dy }));
    }
  };

  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (drag.moved) {
      setIsDragging(false);
      setPos((p) => {
        savePos(p);
        return p;
      });
    } else {
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      setIsSplashing(true);
      window.setTimeout(() => navigate("/fun-facts"), reduceMotion ? 0 : SPLASH_MS);
    }
  };

  if (funFacts.length === 0) return null;
  if (location.pathname.startsWith("/fun-facts")) return null; // already there — no point offering it

  return (
    <button
      type="button"
      ref={buttonRef}
      className={`fun-facts-floater__button ${isDragging ? "is-dragging" : ""} ${
        isSplashing ? "is-splashing" : ""
      }`}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onAnimationEnd={() => setIsSplashing(false)}
      aria-label="Open Fun Facts"
    >
      <span className="fun-facts-floater__burst" aria-hidden="true" />
      <span className="fun-facts-floater__sparkle material-symbols-outlined" aria-hidden="true">
        auto_awesome
      </span>
    </button>
  );
}
