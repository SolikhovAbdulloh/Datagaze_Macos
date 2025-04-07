import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "~/generic/notification";
import { useAxios } from "~/hooks/useAxios";
import { useSignIn } from "react-auth-kit";
import { LoginType } from "~/types/configs";

const useLogin = () => {
  const axios = useAxios();
  const notify = notificationApi();
  const signIn = useSignIn();

  return useMutation({
    mutationFn: async ({ data }: { data: LoginType }) =>
      await axios({ url: "/api/1/auth/login", body: data, method: "POST" }),

    onSuccess: (response, variables) => {
      if (response.status === "success") {
        localStorage.setItem("token", response.token);
      }
      const { username, password } = variables.data;
      const { token } = response;
      signIn({
        token,
        tokenType: "Bearer",
        expiresIn: 3600,
        authState: { username, password }
      });

      notify("superadmin", username);
    },
    onError: (err) => {
      console.log(err.message);
      notify("Not register");
    }
  });
};

const useRegister = () => {
  const notify = notificationApi();
  const queryClient = useQueryClient();
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ data }: { data: object }) => {
      let { username, email, password, fullName }: any = data;
      await axios({
        url: "/api/1/auth/register",
        method: "POST",
        body: { username, email, password, fullName }
      });
      return data;
    },
    onSuccess: (response) => {
      console.log(response);
      notify("Add new user");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin_Users"] });
    },
    onError: (err) => {
      console.log(err);
      notify("Xatolik");
    }
  });
};

const useDeleteRegister = () => {
  const axios = useAxios();
  const notify = notificationApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: any) => {
      await axios({
        url: `/api/1/auth/delete-user/{id}?id=${id}`,
        method: "DELETE"
      });
    },
    onSuccess: () => {
      console.log("success DELETE");
      notify("o'chirildi");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin_Users"] });
    },
    onError: (err) => {
      console.log(err);
      notify("Xatolik");
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
const useUpdateRegister = (data: any) => {
  const axios = useAxios();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios({
        url: "/api/1/auth/update-profile",
        method: "PUT",
        body: { data },
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
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
export {
  useLogin,
  useInstallApplication,
  useDeleteApplication,
  useCreateApplication,
  useRegister,
  useDeleteRegister,
  useUpdateRegister
};
