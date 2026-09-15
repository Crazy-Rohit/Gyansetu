// client/src/context/UserProfileContext.jsx
// Site-wide, no-login personalization: a name + emoji avatar + class
// preference, stored in localStorage. First-time visitors are prompted once
// (see WelcomeModal); after that the profile is just read from here.

import { useCallback, useState } from "react";
import {
  STORAGE_KEY,
  UserProfileContext,
  readProfile,
  DEFAULT_CLASS_PREF,
} from "./userProfileStore";

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(readProfile);
  const [isModalOpen, setIsModalOpen] = useState(() => readProfile() === null);

  const saveProfile = useCallback(({ name, avatar, classPref }) => {
    const next = {
      name: name.trim().slice(0, 24),
      avatar,
      classPref: classPref || DEFAULT_CLASS_PREF,
    };
    if (!next.name) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <UserProfileContext.Provider
      value={{ profile, saveProfile, isModalOpen, openModal, closeModal }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
