import axios from "axios";

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ correct key
  withCredentials: true,                 // ✅ ensures cookies are sent
  timeout: 15000,                        // avoid Render cold-start long hangs
});

// --- OPTIONAL BUT HIGHLY RECOMMENDED ---
// Add interceptors for better reliability

// 🔄 Auto retry once if Render "cold starts"
api.interceptors.response.use(
  res => res,
  async err => {
    const config = err.config;

    // Retry only once
    if (!config.__retry && err.code === "ECONNABORTED") {
      config.__retry = true;
      return api(config);
    }

    // Handle Not authenticated (cookie expired)
    if (err.response?.status === 401) {
      console.warn("API returned 401, clearing local user.");
      // You can emit an event that AuthContext listens to.
    }

    return Promise.reject(err);
  }
);

export default api;