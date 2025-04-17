import { create } from "zustand";

type ProgressStore = {
  progressMessage: number;
  setProgressMessage: (value: number) => void;
  socketId: string;
  progressId: string;
  setSocketId: (id: string) => void;
  setProgressId: (id: string) => void;
};

export const useProgressStore = create<ProgressStore>((set) => ({
  progressMessage: 0,
  socketId: "",
  progressId: "",
  setSocketId: (id) => set({ socketId: id }),
  setProgressId: (id) => set({ progressId: id }),
  setProgressMessage: (message) => set({ progressMessage: message })
}));
