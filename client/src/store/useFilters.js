import { create } from "zustand";

export const useFilters = create((set) => ({
  difficulty: "",
  pattern: "",
  phase: "",

  setFilter: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
}));