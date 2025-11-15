import httpClient from "./httpClient";

export const registerUser = async (form) => {
  // Map frontend fields to backend expectations
  const payload = {
    name: form.name,
    email: form.email || null,
    phone: form.phone || null,
    address: form.address || "",
    institution: form.institution || "",
    role: form.role,                     // 'student' or 'teacher'
    classCode: form.role === "student" ? form.classLevel : null, // '9' or '10'
    password: form.password,
  };

  const res = await httpClient.post("/auth/register", payload);
  return res.data; // { user, token }
};

export const loginUser = async ({ identifier, password }) => {
  const res = await httpClient.post("/auth/login", { identifier, password });
  return res.data; // { user, token }
};
