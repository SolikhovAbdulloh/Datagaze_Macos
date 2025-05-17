import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAxios } from "../useAxios";

interface useQueryApiType<T> {
  pathname: string;
  url: string;
  params?: object;
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">;
}

const useQueryApi = <T>({ pathname, url, params, options }: useQueryApiType<T>) => {
  const axios = useAxios();
  return useQuery({
    queryKey: [pathname],

    queryFn: async () => {
      if (!url) throw new Error("URL berilishi shart!");
      const data = await axios({ method: "GET", url, params });

      if (!data) {
        throw new Error("Serverdan noto‘g‘ri javob keldi!");
      }

      return data;
    },
    ...options
  });
};

export { useQueryApi };

//keshidagi malumotlari olish va saqlash uchun ishlataman
