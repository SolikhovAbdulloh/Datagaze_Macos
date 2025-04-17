import Cookies from "js-cookie";
import { useAxios } from "~/hooks/useAxios";

export interface Usertype {
  username?: string | undefined;
  fullName?: string | undefined;
  email?: string | undefined;
}

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 1 });
};

export const setUser = ({ user }: { user: Usertype | any }) => {
  return Cookies.set("user", user, { expires: 1 });
};
export const getUser = () => {
  const user = Cookies.get("user");

  return user ? JSON.parse(user) : null;
};
export const getToken = () => {
  return Cookies.get("token");
};

export const remove = () => {
  Cookies.remove("token");
  Cookies.remove("user");
};

export const getUserInfo = async () => {
  const axios = useAxios();
  const res = await axios({ url: "/api/1/auth/user", method: "GET" });
  return res;
};
