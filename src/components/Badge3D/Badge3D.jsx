// client/src/components/Badge3D/Badge3D.jsx
//
// Mounts a real Three.js scene showing one checkpoint badge.
//
// Motion: everything is delta-time driven, so it looks identical at 60Hz and
// 144Hz. The badge eases in with a spin, then idles with a slow turn, a gentle
// tilt and a soft float. Dragging spins it directly and releases with inertia
// that settles back into the idle turn.
//
// Exposes an imperative API (getCanvas / renderAtAngle / setAutoRotate) so
// utils/badgeExport.js can drive the rotation deterministically when capturing
// frames for GIF/MP4 — that path pins the tilt and float so exports are
// reproducible.
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as THREE from "three";
import { buildBadgeGroup } from "./badgeGeometry";
import "./badge3d.css";

const IDLE_SPIN = 0.5; // radians per second — one slow turn every ~12s
const INTRO_MS = 950;
const SHOWCASE_TILT = 0.06; // the fixed tilt used for exported frames

/** Smooth deceleration — fast at first, feather-soft at the end. */
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

function disposeGroup(group) {
  group.traverse((obj) => {
    obj.geometry?.dispose();
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    materials.forEach((material) => {
      if (!material) return;
      material.map?.dispose();
      material.dispose?.();
    });
  });
}

const Badge3D = forwardRef(function Badge3D(
  { tone, icon, title, studentName, size = 340, onReady },
  ref
) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const autoRotateRef = useRef(true);
  const [loading, setLoading] = useState(true);

  // Held in a ref so an inline `onReady` from the parent doesn't count as a
  // changed dependency and tear the whole WebGL scene down and rebuild it.
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    let cancelled = false;
    let animationId;
    let group;
    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // required so canvas.toDataURL()/toBlob() capture works
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.75);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(2, 3, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe9c2, 0.85);
    fill.position.set(-3, -1, -2);
    scene.add(fill);
    // Grazing light along the badge's edge — this is what makes the bevels,
    // the raised rim and the logo pedestal read as metal.
    const rim = new THREE.DirectionalLight(0xcfe8ff, 0.55);
    rim.position.set(-1.5, 2.5, -1);
    scene.add(rim);

    // Motion state, all in one object so the render loop stays readable.
    const motion = {
      spin: -0.9, // starts turned away, so the intro sweeps into view
      spinVelocity: IDLE_SPIN,
      elapsed: 0,
      intro: 0,
      pointerTiltX: 0,
      pointerTiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      dragging: false,
    };

    /* ---------- pointer interaction ---------- */
    const host = container;
    let lastPointerX = 0;

    const onPointerMove = (event) => {
      if (motion.dragging) {
        const dx = event.clientX - lastPointerX;
        lastPointerX = event.clientX;
        // Direct 1:1 drag, and remember the speed so the release has inertia.
        motion.spin += dx * 0.011;
        motion.spinVelocity = dx * 0.011 * 60;
        return;
      }
      // Hover parallax: a small tilt that follows the cursor.
      const rect = host.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      motion.targetTiltY = nx * 0.28;
      motion.targetTiltX = ny * 0.2;
    };

    const onPointerLeave = () => {
      motion.targetTiltX = 0;
      motion.targetTiltY = 0;
    };

    const onPointerDown = (event) => {
      motion.dragging = true;
      lastPointerX = event.clientX;
      host.setPointerCapture?.(event.pointerId);
      host.classList.add("is-grabbing");
    };

    const onPointerUp = (event) => {
      motion.dragging = false;
      host.releasePointerCapture?.(event.pointerId);
      host.classList.remove("is-grabbing");
    };

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointercancel", onPointerUp);

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    buildBadgeGroup({ tone, icon, title, studentName }).then((builtGroup) => {
      if (cancelled) {
        disposeGroup(builtGroup);
        return;
      }
      group = builtGroup;
      scene.add(group);
      setLoading(false);
      onReadyRef.current?.();

      if (reduceMotion) {
        motion.spin = 0;
        motion.intro = 1;
        motion.spinVelocity = 0;
      }

      let lastTime = performance.now();

      const animate = (now) => {
        animationId = requestAnimationFrame(animate);

        // Clamped delta: a background tab or a stalled frame must not make the
        // badge jump when it comes back.
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (document.hidden) return;

        if (autoRotateRef.current) {
          motion.elapsed += dt;

          if (!reduceMotion) {
            if (motion.intro < 1) {
              motion.intro = Math.min(1, motion.intro + dt * (1000 / INTRO_MS));
            }

            if (!motion.dragging) {
              // Ease whatever speed the drag left behind back to the idle turn.
              motion.spinVelocity +=
                (IDLE_SPIN - motion.spinVelocity) * Math.min(1, dt * 3);
              motion.spin += motion.spinVelocity * dt;
            }

            // Hover tilt catches up smoothly instead of snapping.
            const follow = Math.min(1, dt * 6);
            motion.pointerTiltX += (motion.targetTiltX - motion.pointerTiltX) * follow;
            motion.pointerTiltY += (motion.targetTiltY - motion.pointerTiltY) * follow;
          }

          const intro = easeOutCubic(motion.intro);
          const t = motion.elapsed;
          // The idle tilt and float are the only always-running motion, so
          // they are what has to go when reduced motion is requested.
          const wobble = reduceMotion ? 0 : Math.sin(t * 0.8) * 0.055;
          const float = reduceMotion ? 0 : Math.sin(t * 0.55) * 0.03;

          group.rotation.y = motion.spin + (1 - intro) * 1.6 + motion.pointerTiltY;
          group.rotation.x = SHOWCASE_TILT + wobble + motion.pointerTiltX;
          group.position.y = float;
          group.scale.setScalar(0.62 + 0.38 * intro);
        }

        renderer.render(scene, camera);
      };

      animationId = requestAnimationFrame(animate);
      sceneRef.current = { renderer, scene, camera, group, motion };
    });

    return () => {
      cancelled = true;
      if (animationId) cancelAnimationFrame(animationId);

      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);

      if (group) disposeGroup(group);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [tone, icon, title, studentName, size]);

  useImperativeHandle(ref, () => ({
    getCanvas: () => sceneRef.current?.renderer.domElement || null,

    /**
     * Renders one exact frame. The idle tilt, float and intro scale are pinned
     * so a captured GIF/MP4 shows a clean turn and nothing else.
     */
    renderAtAngle: (angle) => {
      const s = sceneRef.current;
      if (!s) return null;
      s.group.rotation.set(SHOWCASE_TILT, angle, 0);
      s.group.position.y = 0;
      s.group.scale.setScalar(1);
      s.renderer.render(s.scene, s.camera);
      return s.renderer.domElement;
    },

    setAutoRotate: (enabled) => {
      autoRotateRef.current = enabled;
      const s = sceneRef.current;
      // Resuming after a capture: pick the idle motion back up from where the
      // last captured frame left it, so there's no visible jump.
      if (enabled && s) {
        s.motion.spin = s.group.rotation.y;
        s.motion.spinVelocity = IDLE_SPIN;
        s.motion.intro = 1;
      }
    },
  }));

  return (
    <div className="badge3d-wrap" style={{ width: size, height: size }}>
      <div className="badge3d-canvas-host" ref={containerRef} />
      {loading && (
        <div className="badge3d-loading">
          <span className="badge3d-loading__ring" />
          <span>Minting your badge…</span>
        </div>
      )}
    </div>
  );
});

export default Badge3D;
