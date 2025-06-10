import axios from "axios";
import { getToken, remove } from "~/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

api.interceptors.request.use(
  (config) => {
    const token: string | undefined = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log(
        "Token yaroqsiz yoki muddati tugagan. Foydalanuvchini logout qilamiz.",
        error
      );
      remove();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
