// client/src/components/Badge3D/badgeIcons.js
//
// Checkpoint icons authored directly as THREE.Shape geometry in a Y-up,
// origin-centred ~20-unit box, so they extrude into real raised 3D relief
// on the badge face. Deliberately not SVG parsing (needs DOMParser) and not
// the Material Symbols webfont (load race) — both can silently blank out.
import * as THREE from "three";

/** Half-annulus band, used for the trophy handles. */
function halfRing(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const shape = new THREE.Shape();
  shape.absarc(cx, cy, rOuter, startAngle, endAngle, false);
  shape.absarc(cx, cy, rInner, endAngle, startAngle, true);
  shape.closePath();
  return shape;
}

function rect(x1, y1, x2, y2) {
  const shape = new THREE.Shape();
  shape.moveTo(x1, y1);
  shape.lineTo(x2, y1);
  shape.lineTo(x2, y2);
  shape.lineTo(x1, y2);
  shape.closePath();
  return shape;
}

// First Steps — a sprout: stem with two leaves
function sproutShapes() {
  const stem = rect(-0.9, 1.5, 0.9, -8.5);

  const leafLeft = new THREE.Shape();
  leafLeft.moveTo(0, 0.5);
  leafLeft.bezierCurveTo(-1.5, 5.5, -5.5, 7.5, -9, 6);
  leafLeft.bezierCurveTo(-9, 1.5, -5, -2, 0, 0.5);
  leafLeft.closePath();

  const leafRight = new THREE.Shape();
  leafRight.moveTo(0, 2.5);
  leafRight.bezierCurveTo(1.5, 7.5, 5.5, 9.5, 9, 8);
  leafRight.bezierCurveTo(9, 3.5, 5, 0, 0, 2.5);
  leafRight.closePath();

  return [stem, leafLeft, leafRight];
}

// Bridge Builder — an arch bridge: deck plus arch band
function bridgeShapes() {
  const deck = rect(-10, -4, 10, -6.8);

  const arch = new THREE.Shape();
  arch.moveTo(-8.5, -4);
  arch.absarc(0, -4, 8.5, Math.PI, 0, true);
  arch.lineTo(6, -4);
  arch.absarc(0, -4, 6, 0, Math.PI, false);
  arch.closePath();

  return [deck, arch];
}

// Concept Climber — twin mountain peaks
function mountainShapes() {
  const peaks = new THREE.Shape();
  peaks.moveTo(-10, -7);
  peaks.lineTo(-3, 6.5);
  peaks.lineTo(0.5, 0);
  peaks.lineTo(4, 4);
  peaks.lineTo(10, -7);
  peaks.closePath();
  return [peaks];
}

// Problem Solver — compass ring with needle
function compassShapes() {
  const ring = new THREE.Shape();
  ring.absarc(0, 0, 9.5, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 7.2, 0, Math.PI * 2, true);
  ring.holes.push(hole);

  const needle = new THREE.Shape();
  needle.moveTo(5, 5);
  needle.lineTo(1.7, -1.7);
  needle.lineTo(-5, -5);
  needle.lineTo(-1.7, 1.7);
  needle.closePath();

  return [ring, needle];
}

// Summit Champion — trophy cup with handles, stem and base
function trophyShapes() {
  const cup = new THREE.Shape();
  cup.moveTo(-5, 9);
  cup.lineTo(5, 9);
  cup.lineTo(5, 2.5);
  cup.bezierCurveTo(5, -2.5, -5, -2.5, -5, 2.5);
  cup.closePath();

  const handleLeft = halfRing(-5.2, 5.5, 3.6, 2.3, Math.PI * 0.5, Math.PI * 1.5);
  const handleRight = halfRing(5.2, 5.5, 3.6, 2.3, Math.PI * 1.5, Math.PI * 2.5);
  const stem = rect(-1.6, -2, 1.6, -6);
  const base = rect(-5.2, -6, 5.2, -8.8);

  return [cup, handleLeft, handleRight, stem, base];
}

const ICON_SHAPES = {
  spa: sproutShapes,
  foundation: bridgeShapes,
  landscape: mountainShapes,
  explore: compassShapes,
  emoji_events: trophyShapes,
};

/** The authored icon box is roughly 20 units wide, used to normalise scale. */
export const ICON_BOX = 20;

export function buildIconShapes(iconName) {
  const builder = ICON_SHAPES[iconName] || ICON_SHAPES.spa;
  return builder();
}
