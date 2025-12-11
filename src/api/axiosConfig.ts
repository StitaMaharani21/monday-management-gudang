import axios from "axios";

// Resolve API base from env (expects .../api)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: false, // token-based, no cookies needed
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach bearer token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle 401 globally by clearing token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

