import { create } from "zustand";
export const useAuthStore = create((set) => ({
  user: null,
  initialized: false,
  setSession: (session) => { sessionStorage.setItem("tf-token", session.token); set({ user: session.user, initialized: true }); },
  setUser: (user) => set({ user, initialized: true }),
  finishInitialization: () => set({ initialized: true }),
  logout: () => { sessionStorage.removeItem("tf-token"); set({ user: null, initialized: true }); },
}));
