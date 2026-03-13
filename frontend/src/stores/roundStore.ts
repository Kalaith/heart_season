import { create } from 'zustand';
import { SubmissionPayload } from '../types/game';

interface RoundState {
  draft: SubmissionPayload;
  setField: <K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) => void;
  reset: () => void;
}

const initialDraft: SubmissionPayload = {
  target_character_id: 0,
  stance: 'gentle',
  image_priority: 'authenticity',
  risk_tolerance: 'moderate',
  intent_text: '',
};

export const useRoundStore = create<RoundState>((set) => ({
  draft: initialDraft,
  setField: (key, value) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [key]: value,
      },
    })),
  reset: () => set({ draft: initialDraft }),
}));
