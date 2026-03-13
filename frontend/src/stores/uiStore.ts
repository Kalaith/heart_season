import { create } from 'zustand';

interface UiState {
  message: string | null;
  setMessage: (message: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  message: null,
  setMessage: (message) => set({ message }),
}));
