import Cookies from "js-cookie";

export interface Usertype {
  username: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
}

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 1 });
};

export const setUser = (user: Usertype | any) => {
  Cookies.set("user", user, { expires: 1 });
};

export const getToken = () => {
  return Cookies.get("token");
};

export const remove = () => {
  Cookies.remove("token");
};
