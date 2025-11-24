// client/src/api/adminApi.js
import httpClient from "./httpClient";

// ---------- CLASSES ----------
export const fetchClasses = async () => {
  const res = await httpClient.get("/admin/classes");
  return res.data;
};

export const createClass = async ({ name, code, description }) => {
  const res = await httpClient.post("/admin/classes", {
    name,
    code,
    description,
  });
  return res.data;
};

export const updateClass = async (id, payload) => {
  const res = await httpClient.put(`/admin/classes/${id}`, payload);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await httpClient.delete(`/admin/classes/${id}`);
  return res.data;
};

// ---------- SUBJECTS ----------
export const fetchSubjectsByClass = async (classLevelId) => {
  const res = await httpClient.get(`/admin/subjects/${classLevelId}`);
  return res.data;
};

export const createSubject = async ({ classLevelId, name, code, description }) => {
  const res = await httpClient.post("/admin/subjects", {
    classLevelId,
    name,
    code,
    description,
  });
  return res.data;
};

export const updateSubject = async (id, payload) => {
  const res = await httpClient.put(`/admin/subjects/${id}`, payload);
  return res.data;
};

export const deleteSubject = async (id) => {
  const res = await httpClient.delete(`/admin/subjects/${id}`);
  return res.data;
};

// ---------- CHAPTERS ----------
export const fetchChaptersBySubject = async (subjectId) => {
  const res = await httpClient.get(`/admin/chapters/${subjectId}`);
  return res.data;
};

export const createChapter = async ({
  subjectId,
  title,
  chapterNumber,
  description,
}) => {
  const res = await httpClient.post("/admin/chapters", {
    subjectId,
    title,
    chapterNumber,
    description,
  });
  return res.data;
};

export const updateChapter = async (id, payload) => {
  const res = await httpClient.put(`/admin/chapters/${id}`, payload);
  return res.data;
};

export const deleteChapter = async (id) => {
  const res = await httpClient.delete(`/admin/chapters/${id}`);
  return res.data;
};

// ---------- CONTENT ----------
export const fetchContentByChapter = async (chapterId) => {
  const res = await httpClient.get(`/admin/content/${chapterId}`);
  return res.data;
};

export const createContentItem = async (payload) => {
  const res = await httpClient.post("/admin/content", payload);
  return res.data;
};

export const updateContentItem = async (id, payload) => {
  const res = await httpClient.put(`/admin/content/${id}`, payload);
  return res.data;
};

export const deleteContentItem = async (id) => {
  const res = await httpClient.delete(`/admin/content/${id}`);
  return res.data;
};

// ---------- USERS ----------
export const fetchUsers = async () => {
  const res = await httpClient.get("/admin/users");
  return res.data;
};
