import { create } from "zustand";

interface AuthUsersType {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
}
export const useAuthUsers = create<AuthUsersType>((set) => ({
  id: "",
  fullName: "",
  email: "",
  createdAt: ""
}));

