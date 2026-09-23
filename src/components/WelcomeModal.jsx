// client/src/components/WelcomeModal.jsx
import { useState } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { AVATARS, CLASS_PREFS, DEFAULT_CLASS_PREF } from "../context/userProfileStore";
import "../styles/profile.css";

export default function WelcomeModal() {
  const { profile, isModalOpen, saveProfile, closeModal } = useUserProfile();
  const [name, setName] = useState(profile?.name || "");
  const [avatar, setAvatar] = useState(profile?.avatar || AVATARS[0].emoji);
  const [classPref, setClassPref] = useState(profile?.classPref || DEFAULT_CLASS_PREF);

  if (!isModalOpen) return null;

  const isFirstTime = !profile;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile({ name, avatar, classPref });
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        {!isFirstTime && (
          <button
            type="button"
            className="profile-modal__close"
            onClick={closeModal}
            aria-label="Close"
          >
            ×
          </button>
        )}

        <div className="profile-modal__header">
          <h2 className="profile-modal__title">
            {isFirstTime ? "Welcome to Gyan Setu! 👋" : "Edit your profile"}
          </h2>
          <p className="profile-modal__subtitle">
            {isFirstTime
              ? "Tell us your name and pick an avatar to get started."
              : "Update your name, avatar or class below."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal__body">
          <label className="profile-modal__label" htmlFor="profile-name">
            Your name
          </label>
          <input
            id="profile-name"
            type="text"
            className="profile-modal__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rohit"
            maxLength={24}
            autoFocus
            required
          />

          <span className="profile-modal__label">Pick an avatar</span>
          <div className="profile-modal__avatars">
            {AVATARS.map((a) => (
              <div className="profile-modal__avatar-wrap" key={a.emoji}>
                <button
                  type="button"
                  className={`profile-modal__avatar ${
                    avatar === a.emoji ? "profile-modal__avatar--selected" : ""
                  }`}
                  onClick={() => setAvatar(a.emoji)}
                  aria-label={`${a.name} avatar — ${a.trait}`}
                  aria-pressed={avatar === a.emoji}
                >
                  {a.emoji}
                </button>
                <span className="profile-modal__avatar-tooltip" role="tooltip">
                  <strong>{a.name}</strong>
                  <span>{a.trait}</span>
                </span>
              </div>
            ))}
          </div>

          <span className="profile-modal__label">Which content do you want to see?</span>
          <div className="profile-modal__class-options" role="radiogroup" aria-label="Class content">
            {CLASS_PREFS.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`profile-modal__class-option ${
                  classPref === option.id ? "profile-modal__class-option--selected" : ""
                }`}
                onClick={() => setClassPref(option.id)}
                role="radio"
                aria-checked={classPref === option.id}
              >
                <span className="material-symbols-outlined">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          <p className="profile-modal__class-hint">
            {classPref === "both"
              ? "You'll see both Class 9 and Class 10 courses. Change this anytime from here."
              : "Courses will be narrowed to this class. You can switch to Full Access anytime from here."}
          </p>

          <button type="submit" className="gs-btn profile-modal__submit">
            {isFirstTime ? "Start Learning" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
