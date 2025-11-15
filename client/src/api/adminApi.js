import httpClient from "./httpClient";

// CLASSES
export const fetchClasses = async () => {
  const res = await httpClient.get("/admin/classes");
  return res.data;
};

export const createClass = async ({ name, code, description }) => {
  const res = await httpClient.post("/admin/classes", { name, code, description });
  return res.data;
};

// SUBJECTS
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

// CHAPTERS
export const fetchChaptersBySubject = async (subjectId) => {
  const res = await httpClient.get(`/admin/chapters/${subjectId}`);
  return res.data;
};

export const createChapter = async ({ subjectId, title, chapterNumber, description }) => {
  const res = await httpClient.post("/admin/chapters", {
    subjectId,
    title,
    chapterNumber,
    description,
  });
  return res.data;
};

// CONTENT
export const fetchContentByChapter = async (chapterId) => {
  const res = await httpClient.get(`/admin/content/${chapterId}`);
  return res.data;
};

export const createContentItem = async (payload) => {
  const res = await httpClient.post("/admin/content", payload);
  return res.data;
};

// USERS
export const fetchUsers = async () => {
  const res = await httpClient.get("/admin/users");
  return res.data;
};
