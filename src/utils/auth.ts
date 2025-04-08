import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 1 });
};

export const getToken = () => {
  return Cookies.get("token");
};

export const remove = () => {
  Cookies.remove("token");
};
