import axios from "axios";

// Create a dedicated Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,                 
  timeout: 15000,                        
});


api.interceptors.response.use(
  res => res,
  async err => {
    const config = err.config;

  
    if (!config.__retry && err.code === "ECONNABORTED") {
      config.__retry = true;
      return api(config);
    }

 
    if (err.response?.status === 401) {
      console.warn("API returned 401, clearing local user.");
  
    }

    return Promise.reject(err);
  }
);

export default api;