// client/src/components/BadgeDownloadModal.jsx
import { useRef, useState } from "react";
import Badge3D from "./Badge3D/Badge3D";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  captureRotationFrames,
  captureStillCanvas,
  canvasToBlob,
  downloadBlob,
  encodeGif,
  encodeMp4,
} from "../utils/badgeExport";
import "./badgeDownloadModal.css";

function slugify(text) {
  return (text || "student")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "student";
}

export default function BadgeDownloadModal({ tone, icon, title, onClose }) {
  const { profile } = useUserProfile();
  const badgeRef = useRef(null);
  const [busy, setBusy] = useState(null); // "png" | "jpg" | "gif" | "mp4" | null
  const [error, setError] = useState(null);
  // Every export renders a fresh frame off the live scene, so there is nothing
  // to capture until the badge has finished building.
  const [ready, setReady] = useState(false);

  const studentName = profile?.name || "Student";
  const baseFilename = `gyansetu-badge-${slugify(tone)}-${slugify(studentName)}`;

  async function handleStill(format) {
    if (!badgeRef.current || busy) return;
    setError(null);
    setBusy(format);
    try {
      const canvas = captureStillCanvas(badgeRef.current);
      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      const blob = await canvasToBlob(canvas, mime, format === "jpg" ? 0.92 : undefined);
      downloadBlob(blob, `${baseFilename}.${format}`);
    } catch {
      setError("Couldn't create that image — try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleGif() {
    if (!badgeRef.current || busy) return;
    setError(null);
    setBusy("gif");
    try {
      const frames = captureRotationFrames(badgeRef.current);
      const blob = await encodeGif(frames);
      downloadBlob(blob, `${baseFilename}.gif`);
    } catch {
      setError("Couldn't create the GIF — try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleMp4() {
    if (!badgeRef.current || busy) return;
    setError(null);
    setBusy("mp4");
    try {
      const frames = captureRotationFrames(badgeRef.current);
      const blob = await encodeMp4(frames);
      downloadBlob(blob, `${baseFilename}.mp4`);
    } catch {
      setError("Couldn't create the video — try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="badge-modal-overlay" onClick={onClose}>
      <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="badge-modal__close" onClick={onClose} aria-label="Close">
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="badge-modal__title">{title}</h2>
        <p className="badge-modal__subtitle">{studentName}'s badge</p>

        <Badge3D
          ref={badgeRef}
          tone={tone}
          icon={icon}
          title={title}
          studentName={studentName}
          size={360}
          onReady={() => setReady(true)}
        />

        <div className="badge-modal__actions">
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={() => handleStill("png")} disabled={!ready || !!busy}>
            {busy === "png" ? "Saving…" : "PNG"}
          </button>
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={() => handleStill("jpg")} disabled={!ready || !!busy}>
            {busy === "jpg" ? "Saving…" : "JPG"}
          </button>
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={handleGif} disabled={!ready || !!busy}>
            {busy === "gif" ? "Encoding…" : "GIF"}
          </button>
          <button type="button" className="gs-btn quiz-btn-secondary" onClick={handleMp4} disabled={!ready || !!busy}>
            {busy === "mp4" ? "Encoding… (~10-20s)" : "MP4"}
          </button>
        </div>

        {error && <p className="badge-modal__error">{error}</p>}
      </div>
    </div>
  );
}
