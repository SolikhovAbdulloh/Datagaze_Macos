import api from "./api";
import type { AxiosProgressEvent } from "axios";

interface PropsType {
  url?: string;
  method: "GET" | "DELETE" | "PUT" | "POST" | "PATCH";
  params?: object;
  headers?: object;
  body?: object;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const useAxios = () => {
  const response = async ({
    url,
    headers,
    params,
    method = "GET",
    body,
    onUploadProgress
  }: PropsType) => {
    try {
      const { data } = await api({
        url: `${import.meta.env.VITE_BASE_URL}${url}`,
        data: body,
        method,
        onUploadProgress,
        params: {
          ...params
        },
        headers
      });
      return data;
    } catch (error) {
      console.log("Api xatosi", error);
      return Promise.reject(error);
    }
  };
  return response;
};
