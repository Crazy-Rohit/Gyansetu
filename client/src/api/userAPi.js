// client/src/api/userApi.js
import httpClient from "./httpClient";

export const getMyProfile = async () => {
  const res = await httpClient.get("/users/me");
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await httpClient.put("/users/me", payload);
  return res.data;
};
