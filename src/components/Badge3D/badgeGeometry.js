// client/src/components/Badge3D/badgeGeometry.js
//
// Builds the real 3D geometry + face textures for a checkpoint badge.
//
// Design language — the "Gyan Setu challenge coin" series:
//   * The silhouette carries the checkpoint identity: coin, keystone arch,
//     crystal hexagon, compass octagon, champion sunburst. Never a hanging
//     medal-on-a-ribbon.
//   * The Gyan Setu logo sits dead centre on a raised pedestal, on both faces.
//   * The checkpoint title curves along the top arc, the student's name along
//     the bottom arc.
//   * Both faces are built by the same function, so the two sides match.
import * as THREE from "three";
import logoUrl from "../../assets/images/gyansetu-logo.webp";
import { buildIconShapes } from "./badgeIcons";

// Same hex values already backing the flat `checkpoint-tone--*` chips in
// quiz.css (--gs-primary-container, --gs-tertiary-container, etc.), so the
// 3D badge stays visually consistent with the rest of the site.
export const TONE_COLORS = {
  sprout: {
    base: 0x2e7d32, accent: 0xd8ffd0, rim: 0x1b5e20, relief: 0xa9f7a1,
    logoBg: 0xf2fff0, metalness: 0.55, roughness: 0.45,
  },
  clay: {
    base: 0x8d662d, accent: 0xffeedc, rim: 0x5a3d0a, relief: 0xffd9a8,
    logoBg: 0xfff6ec, metalness: 0.7, roughness: 0.35,
  },
  summit: {
    base: 0xffb231, accent: 0x3a2400, rim: 0xc98600, relief: 0xfff3d0,
    logoBg: 0xfffaf0, metalness: 0.85, roughness: 0.22,
  },
  forest: {
    base: 0x0d631b, accent: 0xa3f69c, rim: 0x00390a, relief: 0xcbffc2,
    logoBg: 0xf0fff0, metalness: 0.8, roughness: 0.25,
  },
  champion: {
    base: 0xffc94d, accent: 0x3a2400, rim: 0xd99b00, relief: 0xfff6d8,
    logoBg: 0xfffdf4, metalness: 0.9, roughness: 0.14, emissive: 0xffdd88,
  },
};

// Silhouette size per tier, escalating so the rank reads at a glance. The
// biggest half-extent (champion, ~1.42 with its bevel) stays inside the 1.50
// that the camera in Badge3D.jsx frames.
const TIER_SCALE = {
  sprout: 1.06,
  clay: 1.16,
  summit: 1.22,
  forest: 1.407,
  champion: 1.36,
};

// Medallion radius as a fraction of `radius`. Each shape's inradius — the
// biggest circle that fits inside it — is noted below; the fit also has to
// leave room for the raised rim ring, which sits at medallion * 1.03.
const FACE_FIT = {
  sprout: 0.85, // circle, inradius 1.000
  clay: 0.79, // keystone arch, inradius 0.900
  summit: 0.76, // hexagon, inradius 0.866
  forest: 0.68, // octagon, inradius 0.924
  champion: 0.74, // 12-point sunburst, inradius 0.820
};

// Thin, pin-like profile rather than a chunky puck.
const BODY_DEPTH = 0.13;
const BODY_BEVEL = 0.045;

const hex = (n) => `#${n.toString(16).padStart(6, "0")}`;

let logoImagePromise = null;
function loadLogoImage() {
  if (!logoImagePromise) {
    logoImagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = logoUrl;
    });
  }
  return logoImagePromise;
}

// Wait (briefly) for webfonts so text renders in Plus Jakarta Sans rather
// than a fallback — but never block the badge on it.
async function waitForFonts() {
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch {
    // font loading API unavailable — fall through with system fonts
  }
}

/**
 * Lays `text` out along a circular arc, one glyph at a time. `bottom: true`
 * runs it along the bottom of the circle, still upright and reading
 * left-to-right.
 */
function drawArcText(ctx, text, { cx, cy, radius, font, color, bottom = false, letterSpacing = 4 }) {
  if (!text) return;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width + letterSpacing);
  const totalAngle = widths.reduce((sum, w) => sum + w, 0) / radius;

  ctx.translate(cx, cy);
  // The top arc sweeps clockwise from the left; the bottom arc sweeps the
  // other way so it also reads left-to-right.
  ctx.rotate(bottom ? Math.PI + totalAngle / 2 : -totalAngle / 2);

  chars.forEach((ch, i) => {
    const step = ((bottom ? -1 : 1) * (widths[i] / radius)) / 2;
    ctx.rotate(step);
    ctx.save();
    ctx.translate(0, -radius);
    if (bottom) ctx.rotate(Math.PI);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    ctx.rotate(step);
  });

  ctx.restore();
}

/** Shrinks the font until `text` fits inside `maxAngle` of arc. */
function fitArcFont(ctx, text, { radius, maxAngle, weight, basePx, letterSpacing }) {
  let px = basePx;
  for (let i = 0; i < 14; i++) {
    ctx.font = `${weight} ${px}px "Plus Jakarta Sans", system-ui, sans-serif`;
    const width = [...text].reduce(
      (sum, ch) => sum + ctx.measureText(ch).width + letterSpacing,
      0
    );
    if (width / radius <= maxAngle) break;
    px *= 0.92;
  }
  return `${weight} ${px}px "Plus Jakarta Sans", system-ui, sans-serif`;
}

function engravedRing(ctx, size, color, { radius, alpha, lineWidth }) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function canvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function newCanvas(size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

// The curved title and name each span at most 126 degrees, which leaves the
// horizontal band at the badge's waist free for the raised side reliefs.
const ARC_SPAN = Math.PI * 0.7;
const ARC_RADIUS = 0.372; // fraction of the texture size

/**
 * Medallion decal: engraved rings, the checkpoint title curved along the top
 * and the student's name curved along the bottom. The middle is left empty —
 * the raised logo pedestal covers it.
 */
async function buildMedallionTexture({ colors, title, studentName }) {
  const size = 768;
  const canvas = newCanvas(size);
  const ctx = canvas.getContext("2d");
  const accent = hex(colors.accent);

  await waitForFonts();
  engravedRing(ctx, size, accent, { radius: 0.455, alpha: 0.5, lineWidth: 6 });
  engravedRing(ctx, size, accent, { radius: 0.415, alpha: 0.22, lineWidth: 2.5 });

  const arcRadius = size * ARC_RADIUS;

  const titleText = (title || "Checkpoint").toUpperCase();
  drawArcText(ctx, titleText, {
    cx: size / 2,
    cy: size / 2,
    radius: arcRadius,
    font: fitArcFont(ctx, titleText, {
      radius: arcRadius, maxAngle: ARC_SPAN, weight: 800,
      basePx: size * 0.068, letterSpacing: 4,
    }),
    color: accent,
  });

  const nameText = (studentName || "Student").trim().toUpperCase();
  drawArcText(ctx, nameText, {
    cx: size / 2,
    cy: size / 2,
    radius: arcRadius,
    font: fitArcFont(ctx, nameText, {
      radius: arcRadius, maxAngle: ARC_SPAN, weight: 800,
      basePx: size * 0.064, letterSpacing: 4,
    }),
    color: accent,
    bottom: true,
  });

  return canvasTexture(canvas);
}

/**
 * The pedestal cap: a light disc carrying the Gyan Setu logo at full
 * opacity. This is what sits at the exact centre of both faces.
 */
async function buildLogoTexture({ colors }) {
  const size = 512;
  const canvas = newCanvas(size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = hex(colors.logoBg);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.strokeStyle = hex(colors.rim);
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = size * 0.035;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.47, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  try {
    const logo = await loadLogoImage();
    const logoSize = size * 0.76;
    ctx.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);
  } catch {
    // logo failed to load — the pedestal still renders as a clean disc
  }

  return canvasTexture(canvas);
}

function extrudedMesh(shapes, material, { depth, bevelSize, bevelThickness, bevelSegments = 4 }) {
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelSize,
    bevelThickness,
    bevelSegments,
    curveSegments: 24,
  });
  geometry.center();
  geometry.computeBoundingBox();
  return new THREE.Mesh(geometry, material);
}

function circleShape(radius) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, radius, 0, Math.PI * 2, false);
  return shape;
}

/** Keystone arch — the Bridge Builder silhouette. Inradius 0.9 * radius. */
function archShape(radius) {
  const w = radius * 1.8;
  const h = radius * 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(-w / 2, 0);
  shape.absarc(0, 0, w / 2, Math.PI, 0, true);
  shape.lineTo(w / 2, -h / 2);
  shape.closePath();
  return shape;
}

function normalize([x, y]) {
  const len = Math.hypot(x, y) || 1;
  return [x / len, y / len];
}

/** Builds a rounded-corner polygon THREE.Shape from a list of [x,y] points. */
function roundedPolygon(points, cornerRadius) {
  const shape = new THREE.Shape();
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];
    const toPrev = normalize([prev[0] - curr[0], prev[1] - curr[1]]);
    const toNext = normalize([next[0] - curr[0], next[1] - curr[1]]);
    const p1 = [curr[0] + toPrev[0] * cornerRadius, curr[1] + toPrev[1] * cornerRadius];
    const p2 = [curr[0] + toNext[0] * cornerRadius, curr[1] + toNext[1] * cornerRadius];
    if (i === 0) shape.moveTo(p1[0], p1[1]);
    else shape.lineTo(p1[0], p1[1]);
    shape.quadraticCurveTo(curr[0], curr[1], p2[0], p2[1]);
  }
  shape.closePath();
  return shape;
}

/**
 * Regular n-gon with softened corners. Rounding pulls the vertices in but
 * leaves the edges — and therefore the inradius — untouched, so the medallion
 * sizing in FACE_FIT stays valid.
 */
function regularPolygon(radius, sides, rotation, cornerRatio) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = rotation + (i / sides) * Math.PI * 2;
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  return roundedPolygon(points, radius * cornerRatio);
}

/** Crystal hexagon — flat left/right edges, points top and bottom. */
function hexagonShape(radius) {
  return regularPolygon(radius, 6, Math.PI / 2, 0.14);
}

/** Compass octagon — flat edges facing the axes. */
function octagonShape(radius) {
  return regularPolygon(radius, 8, Math.PI / 8, 0.1);
}

/** Champion sunburst. The inner radius stays high to keep the face large. */
function sunburstShape(radius, points = 12, innerRatio = 0.82) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * innerRatio;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const SHAPE_BUILDERS = {
  sprout: circleShape,
  clay: archShape,
  summit: hexagonShape,
  forest: octagonShape,
  champion: sunburstShape,
};

/**
 * Extrudes the checkpoint icon into a genuinely raised relief. Fitted to an
 * explicit box rather than the nominal authoring size, because the icons
 * differ a lot in aspect ratio — the bridge is wide and short, the sprout
 * tall and narrow.
 */
function buildIconRelief(material, { icon, maxWidth, maxHeight }) {
  const geometry = new THREE.ExtrudeGeometry(buildIconShapes(icon), {
    depth: 1.2,
    bevelEnabled: true,
    bevelSize: 0.25,
    bevelThickness: 0.25,
    bevelSegments: 2,
    curveSegments: 20,
  });
  geometry.center();
  geometry.computeBoundingBox();

  const bb = geometry.boundingBox;
  const width = Math.max(bb.max.x - bb.min.x, 1e-6);
  const height = Math.max(bb.max.y - bb.min.y, 1e-6);
  const s = Math.min(maxWidth / width, maxHeight / height);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(s);
  return { mesh, halfDepth: bb.max.z * s };
}

/**
 * Builds one complete badge face, with its origin on the badge's outer
 * surface and its artwork growing towards +z. The back is a clone of this
 * rotated 180 degrees, so both sides are identical by construction.
 */
function buildFace({ colors, icon, medallionRadius, rimTube, medallionTexture, logoTexture }) {
  const face = new THREE.Group();

  // Recessed darker plate, for the enamel-pin depth read.
  const plate = new THREE.Mesh(
    new THREE.CircleGeometry(medallionRadius, 72),
    new THREE.MeshStandardMaterial({
      color: colors.rim,
      metalness: colors.metalness * 0.8,
      roughness: Math.min(0.7, colors.roughness + 0.15),
    })
  );
  face.add(plate);

  // Raised rim ring framing the medallion — a real 3D element, not a painted
  // circle.
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(medallionRadius * 1.03, rimTube, 12, 80),
    new THREE.MeshStandardMaterial({
      color: colors.relief,
      metalness: 0.9,
      roughness: 0.2,
    })
  );
  rim.position.z = 0.004;
  face.add(rim);

  // Engraved rings + the curved title and name.
  const decal = new THREE.Mesh(
    new THREE.PlaneGeometry(medallionRadius * 2, medallionRadius * 2),
    new THREE.MeshStandardMaterial({
      map: medallionTexture,
      transparent: true,
      metalness: 0.15,
      roughness: 0.5,
      depthWrite: false,
    })
  );
  decal.position.z = 0.012;
  face.add(decal);

  // Raised side reliefs at the badge's waist — the stage graphic, mirrored so
  // the face reads symmetrically and the arcs stay clear.
  const reliefMaterial = new THREE.MeshStandardMaterial({
    color: colors.relief,
    metalness: 0.78,
    roughness: 0.26,
    side: THREE.DoubleSide,
  });
  for (const side of [-1, 1]) {
    const { mesh, halfDepth } = buildIconRelief(reliefMaterial, {
      icon,
      maxWidth: medallionRadius * 0.3,
      maxHeight: medallionRadius * 0.34,
    });
    mesh.position.set(side * medallionRadius * 0.6, 0, 0.016 + halfDepth);
    face.add(mesh);
  }

  // Raised pedestal at the exact centre, carrying the Gyan Setu logo.
  const pedestalRadius = medallionRadius * 0.42;
  const pedestal = extrudedMesh(
    circleShape(pedestalRadius),
    new THREE.MeshStandardMaterial({
      color: colors.relief,
      metalness: 0.85,
      roughness: 0.22,
    }),
    { depth: 0.05, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 3 }
  );
  const pedestalHalf = pedestal.geometry.boundingBox?.max.z ?? 0.043;
  pedestal.position.z = 0.014 + pedestalHalf;
  face.add(pedestal);

  const logoCap = new THREE.Mesh(
    new THREE.CircleGeometry(pedestalRadius * 0.9, 64),
    new THREE.MeshStandardMaterial({
      map: logoTexture,
      metalness: 0.1,
      roughness: 0.45,
    })
  );
  logoCap.position.z = pedestal.position.z + pedestalHalf + 0.004;
  face.add(logoCap);

  return face;
}

/**
 * Builds the full badge group. `icon` is a key in badgeIcons.js, `title` is
 * curved along the top of both faces and `studentName` along the bottom.
 */
export async function buildBadgeGroup({ tone, icon, title, studentName }) {
  const colors = TONE_COLORS[tone] || TONE_COLORS.sprout;
  const radius = TIER_SCALE[tone] || 1;
  const medallionRadius = radius * (FACE_FIT[tone] ?? 0.8);

  const group = new THREE.Group();

  const body = extrudedMesh(
    (SHAPE_BUILDERS[tone] || circleShape)(radius),
    new THREE.MeshStandardMaterial({
      color: colors.base,
      metalness: colors.metalness,
      roughness: colors.roughness,
      emissive: colors.emissive || 0x000000,
      emissiveIntensity: colors.emissive ? 0.28 : 0,
    }),
    { depth: BODY_DEPTH, bevelSize: BODY_BEVEL, bevelThickness: BODY_BEVEL }
  );
  group.add(body);

  // Both real surfaces are read off the geometry (bevel included) rather than
  // hand-computed — getting this wrong buries the artwork inside the badge.
  const frontZ = (body.geometry.boundingBox?.max.z ?? BODY_DEPTH / 2) + 0.008;
  const backZ = (body.geometry.boundingBox?.min.z ?? -BODY_DEPTH / 2) - 0.008;

  const [medallionTexture, logoTexture] = await Promise.all([
    buildMedallionTexture({ colors, title, studentName }),
    buildLogoTexture({ colors }),
  ]);

  const front = buildFace({
    colors,
    icon,
    medallionRadius,
    rimTube: radius * 0.022,
    medallionTexture,
    logoTexture,
  });
  front.position.z = frontZ;
  group.add(front);

  // Cloning guarantees the two sides are identical; the clone shares the same
  // geometries and materials, so it costs almost nothing.
  const back = front.clone();
  back.position.z = backZ;
  back.rotation.y = Math.PI;
  group.add(back);

  return group;
}
