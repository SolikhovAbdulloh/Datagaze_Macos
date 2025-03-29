import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "~/generic/notification";
import { useAxios } from "~/hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { RegisterType } from "~/types";

const useRegister = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const notify = notificationApi();
  return useMutation({
    mutationFn: async ({ data }: { data: RegisterType }) =>
      await axios({ url: "/api/1/auth/login", body: data, method: "POST" }),

    onSuccess: (data) => {
      if (data.status === "success") {
        localStorage.setItem("token", data.token);
      }

      notify("superadmin");
      navigate("/desktop", { replace: true });
    },
    onError: (err) => {
      console.log(err.message);
      notify("Not register");
    }
  });
};

const useInstallApplication = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const notify = notificationApi();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data?: any }) => {
      const response = await axios({
        url: `/api/1/desktop/install/${id}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
      });
      return response.data;
    },
    onSuccess: (response) => {
      console.log("Success application:", response);
      notify("Install");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (err) => {
      console.error(err.message);
    }
  });
};

const useDeleteApplication = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();
  const notify = notificationApi();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await axios({
        url: `/api/1/desktop/uninstall/${id}`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (response) => {
      console.log(response);
      notify("Uninstall");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (err) => {
      console.error(err.message);
    }
  });
};

const useCreateApplication = () => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ data }: any) => {
      const response = await axios({
        url: "/api/1/desktop/create",
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: data
      });
      return response.data;
    },
    onSuccess: (response) => {
      console.log("Create malumotlari:", response);
    },
    onError: (err) => {
      console.log(err.message);
    }
  });
};
export { useRegister, useInstallApplication, useDeleteApplication, useCreateApplication };
