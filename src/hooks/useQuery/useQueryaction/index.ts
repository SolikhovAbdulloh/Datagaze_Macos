import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "~/generic/notification";
import { useAxios } from "~/hooks/useAxios";
import { LoginType } from "~/types/configs";
import { RegisterUser } from "~/types/configs/register";
import { getUserInfo, setToken } from "~/utils";

const useLogin = () => {
  const axios = useAxios();
  const notify = notificationApi();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ data }: { data: LoginType }) =>
      await axios({ url: "/api/1/auth/login", body: data, method: "POST" }),

    onSuccess: async (response) => {
      if (response.status === "success") {
        setToken(response.token);
        navigate("/desktop");
      }

      const { token } = response;

      Cookies.set("token", token, {
        expires: 1,
        path: "/",
        secure: true,
        sameSite: "strict"
      });

      const userData = await getUserInfo();
      const user = userData?.username;

      notify("superadmin", user);

      Cookies.set(
        "user",
        JSON.stringify({
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email
        }),
        { expires: 1, path: "/", secure: true, sameSite: "Strict" }
      );
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
      let { username, email, password, fullName } = data as RegisterUser;
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
    mutationFn: async (id: string) => {
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

const useTransferApplication = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: object }) => {
      await axios({
        url: `/api/1/desktop/transfer/${id}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
      });
    },
    onSuccess: () => {
      console.log("Success application");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (err) => {
      console.error(err);
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
const useInstallApplication = () => {
  const notify = notificationApi();
  const queryClient = useQueryClient();
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ data }: { data: object }) => {
      await axios({
        url: `/api/1/ssh/connect`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data
      });
    },
    onSuccess: (res) => {
      console.log(res);
      notify("Install");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (err) => {
      console.log(err.message);
    }
  });
};
const useUpdateRegister = () => {
  const notify = notificationApi();
  const queryClient = useQueryClient();
  const axios = useAxios();
  return useMutation({
    mutationFn: async ({ data }: { data: object }) => {
      const { username, fullName, password, userId, email } = data as RegisterUser;
      await axios({
        url: "/api/1/auth/update-profile",
        method: "PUT",
        body: { username, fullName, password, userId, email },
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (res) => {
      console.log(res);
      notify("Update");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin_Users"] });
    },
    onError: (err) => {
      console.log(err);
    }
  });
};

const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios({
        url: "/api/1/desktop/create",
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data"
        },
        body: data
      });
      return response.data;
    },
    onSuccess: (response) => {
      console.log("Muvaffaqiyatli yuborildi:", response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["application"] });
    },
    onError: (err) => {
      console.error("Xato yuz berdi:", err.message);
    }
  });
};

export {
  useLogin,
  useTransferApplication,
  useDeleteApplication,
  useCreateApplication,
  useRegister,
  useDeleteRegister,
  useInstallApplication,
  useUpdateRegister
};
