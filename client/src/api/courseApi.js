// client/src/api/courseApi.js
import httpClient from "./httpClient";

/**
 * Fetch all active classes for the public course section.
 * GET /api/courses/classes
 */
export const fetchPublicClasses = async () => {
  const res = await httpClient.get("/courses/classes");
  return res.data;
};

/**
 * Fetch subjects for a given class.
 * GET /api/courses/subjects/:classLevelId
 */
export const fetchPublicSubjects = async (classLevelId) => {
  const res = await httpClient.get(`/courses/subjects/${classLevelId}`);
  return res.data;
};

/**
 * Fetch chapters for a given subject.
 * GET /api/courses/chapters/:subjectId
 */
export const fetchPublicChapters = async (subjectId) => {
  const res = await httpClient.get(`/courses/chapters/${subjectId}`);
  return res.data;
};

/**
 * Fetch content for a given chapter, grouped by type.
 * GET /api/courses/content/:chapterId
 * Returns: { lectures: [], notes: [], tests: [], books: [] }
 */
export const fetchPublicContent = async (chapterId) => {
  const res = await httpClient.get(`/courses/content/${chapterId}`);
  return res.data;
};
