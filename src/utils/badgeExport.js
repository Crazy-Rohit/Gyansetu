// client/src/utils/badgeExport.js
// Capture/encode/download pipeline for the 3D badge. PNG/JPG need nothing
// extra; GIF and MP4 each dynamically import their (heavier) encoder only
// when actually used, so viewing/quiz pages never pay for these libraries.

import { withBase } from "./publicPath";

const FRAME_COUNT = 24; // one full rotation, captured deterministically

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Copies the live badge canvas into a standalone canvas (so later frames don't overwrite earlier captures). */
function cloneCanvas(sourceCanvas) {
  const clone = document.createElement("canvas");
  clone.width = sourceCanvas.width;
  clone.height = sourceCanvas.height;
  clone.getContext("2d").drawImage(sourceCanvas, 0, 0);
  return clone;
}

/**
 * Grabs a still of the badge facing the camera head-on, whatever angle the
 * idle spin happens to be at when the button is pressed — a download should
 * never catch the badge edge-on or mid-turn.
 *
 * renderAtAngle(0) also pins the tilt, float and intro scale, so this is the
 * exact same framing as the first frame of the GIF/MP4. The render and the
 * copy both happen in this one synchronous task, so the idle animation cannot
 * slip a frame in between — which is why the on-screen badge keeps spinning
 * without a visible jump, and why autoRotate does not need pausing here.
 */
export function captureStillCanvas(badgeApi) {
  const canvas = badgeApi.renderAtAngle(0);
  if (!canvas) return null;
  return cloneCanvas(canvas);
}

export function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

/**
 * Steps the badge through one full rotation, capturing a still frame at each
 * step. Frame 0 is the head-on front face, so the loop opens and closes on
 * the same view a downloaded PNG/JPG gives.
 */
export function captureRotationFrames(badgeApi, frameCount = FRAME_COUNT) {
  badgeApi.setAutoRotate(false);
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    const angle = (i / frameCount) * Math.PI * 2;
    const canvas = badgeApi.renderAtAngle(angle);
    if (canvas) frames.push(cloneCanvas(canvas));
  }
  badgeApi.setAutoRotate(true);
  return frames;
}

/** Encodes a sequence of canvases into an animated GIF (gif.js, runs in a Web Worker). */
export async function encodeGif(frames, { delayMs = 80 } = {}) {
  const { default: GIF } = await import("gif.js");

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 8,
      workerScript: withBase("/vendor/gif.worker.js"),
      width: frames[0].width,
      height: frames[0].height,
      transparent: 0x000000,
    });

    frames.forEach((canvas) => gif.addFrame(canvas, { delay: delayMs, copy: true }));
    gif.on("finished", (blob) => resolve(blob));
    gif.on("abort", () => reject(new Error("GIF encoding aborted")));
    gif.render();
  });
}

/** Encodes a sequence of canvases into a real H.264 .mp4 (ffmpeg.wasm). */
export async function encodeMp4(frames, { fps = 12 } = {}) {
  const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
    import("@ffmpeg/ffmpeg"),
    import("@ffmpeg/util"),
  ]);

  const ffmpeg = new FFmpeg();
  // Core WASM (~31MB) is fetched from the CDN on first use and then cached by
  // the browser, rather than shipped in the repo/deploy — it is only ever
  // needed when someone actually downloads an MP4.
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  for (let i = 0; i < frames.length; i++) {
    const blob = await canvasToBlob(frames[i], "image/png");
    const data = await fetchFile(blob);
    await ffmpeg.writeFile(`frame${String(i).padStart(3, "0")}.png`, data);
  }

  await ffmpeg.exec([
    "-framerate", String(fps),
    "-i", "frame%03d.png",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "out.mp4",
  ]);

  const data = await ffmpeg.readFile("out.mp4");
  return new Blob([data.buffer], { type: "video/mp4" });
}
