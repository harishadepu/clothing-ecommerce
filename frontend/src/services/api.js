import axios from "axios";

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 15000,
});

// ✅ Attach token from localStorage/session to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const config = err.config;

    // Retry once if timeout
    if (!config.__retry && err.code === "ECONNABORTED") {
      config.__retry = true;
      return api(config);
    }

    // Handle unauthorized
    if (err.response?.status === 401) {
      console.warn("API returned 401, clearing local user.");
      // Optionally clear token
      localStorage.removeItem("token");
      // You could also dispatch a logout event here
      window.dispatchEvent(new Event("auth-logout"));
    }

    return Promise.reject(err);
  }
);

export default api;