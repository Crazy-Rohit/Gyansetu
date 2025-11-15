import axios from "axios";

const httpClient = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
});

// If later you add auth token:
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("gs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
