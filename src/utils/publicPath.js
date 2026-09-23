// src/utils/publicPath.js
//
// Data files (coursesData.js) and a couple of components reference files in
// /public with a leading-slash path like "/documents/class-9/...". Those
// resolve fine at the site root, but this site is deployed under a GitHub
// Pages subpath (see vite.config.js's `base`), so they need that prefix too.
// Vite exposes the configured base as import.meta.env.BASE_URL at build time.

export function withBase(path) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
