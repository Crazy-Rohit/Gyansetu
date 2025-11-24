// client/src/api/courseApi.js
import httpClient from "./httpClient";

export const fetchPublicClasses = async () => {
  const res = await httpClient.get("/courses/classes");
  return res.data;
};

export const fetchPublicSubjects = async (classLevelId) => {
  const res = await httpClient.get(`/courses/subjects/${classLevelId}`);
  return res.data;
};

export const fetchPublicChapters = async (subjectId) => {
  const res = await httpClient.get(`/courses/chapters/${subjectId}`);
  return res.data;
};

export const fetchPublicContent = async (chapterId) => {
  const res = await httpClient.get(`/courses/content/${chapterId}`);
  return res.data;
};
