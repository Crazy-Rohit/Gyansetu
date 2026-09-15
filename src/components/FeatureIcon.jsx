// src/components/FeatureIcon.jsx
const ICONS = {
  spark: (
    <path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5L3.5 11 10 9l2-6.5Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  cap: (
    <>
      <path d="m2 9 10-4.5L22 9l-10 4.5L2 9Z" />
      <path d="M6 11v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-5" />
    </>
  ),
  chat: (
    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8A2.5 2.5 0 0 1 18.5 16H9l-5 4v-4H5.5A2.5 2.5 0 0 1 3 13.5v-8Z" />
  ),
  shield: (
    <path d="M12 2.5 20 6v6c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V6l8-3.5Z" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20v-1.3A4.2 4.2 0 0 1 7.7 14.5h2.6a4.2 4.2 0 0 1 4.2 4.2V20" />
      <path d="M15.5 3.4a3.6 3.6 0 0 1 0 6.9" />
      <path d="M20.5 20v-1.3a4.1 4.1 0 0 0-2.8-3.9" />
    </>
  ),
};

export default function FeatureIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name] || ICONS.spark}
    </svg>
  );
}
