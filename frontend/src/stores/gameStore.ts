import { create } from 'zustand';
import { SeasonState, PlayerResult, CharacterSummary, ReputationState, RoundSummary } from '../types/game';

interface GameState {
  seasonState: SeasonState | null;
  latestResult: PlayerResult | null;
  cast: CharacterSummary[];
  history: RoundSummary[];
  reputation: ReputationState | null;
  setSeasonState: (seasonState: SeasonState) => void;
  setLatestResult: (latestResult: PlayerResult | null) => void;
  setCast: (cast: CharacterSummary[]) => void;
  setHistory: (history: RoundSummary[]) => void;
  setReputation: (reputation: ReputationState) => void;
}

export const useGameStore = create<GameState>((set) => ({
  seasonState: null,
  latestResult: null,
  cast: [],
  history: [],
  reputation: null,
  setSeasonState: (seasonState) => set({ seasonState }),
  setLatestResult: (latestResult) => set({ latestResult }),
  setCast: (cast) => set({ cast }),
  setHistory: (history) => set({ history }),
  setReputation: (reputation) => set({ reputation }),
}));
