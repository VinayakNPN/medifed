import { create } from 'zustand';

interface UserState {
  role: 'coordinator' | 'hospital' | null;
  setRole: (role: 'coordinator' | 'hospital' | null) => void;
}

export const useStore = create<UserState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));
