import { useEffect } from 'react';
import { fetchCast } from '../api/services/cast';
import { fetchReputation } from '../api/services/reputation';
import { fetchRoundHistory, fetchLatestResults } from '../api/services/rounds';
import { fetchCurrentSeason } from '../api/services/season';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';

const loadBootstrapData = async (
  setSeasonState: (seasonState: Awaited<ReturnType<typeof fetchCurrentSeason>>) => void,
  setCast: (cast: Awaited<ReturnType<typeof fetchCast>>) => void,
  setHistory: (history: Awaited<ReturnType<typeof fetchRoundHistory>>) => void,
  setLatestResult: (latestResult: Awaited<ReturnType<typeof fetchLatestResults>>) => void,
  setReputation: (reputation: Awaited<ReturnType<typeof fetchReputation>>) => void,
  setMessage: (message: string | null) => void,
): Promise<void> => {
  try {
    const [seasonState, cast, history, latestResult, reputation] = await Promise.all([
      fetchCurrentSeason(),
      fetchCast(),
      fetchRoundHistory(),
      fetchLatestResults(),
      fetchReputation(),
    ]);

    setSeasonState(seasonState);
    setCast(cast);
    setHistory(history);
    setLatestResult(latestResult);
    setReputation(reputation);
  } catch {
    setMessage('Unable to load season data.');
  }
};

export const useBootstrapData = (): (() => Promise<void>) => {
  const { setSeasonState, setCast, setHistory, setLatestResult, setReputation } = useGameStore();
  const setMessage = useUiStore((state) => state.setMessage);

  useEffect(() => {
    void loadBootstrapData(
      setSeasonState,
      setCast,
      setHistory,
      setLatestResult,
      setReputation,
      setMessage,
    );
  }, [setCast, setHistory, setLatestResult, setMessage, setReputation, setSeasonState]);

  return () =>
    loadBootstrapData(setSeasonState, setCast, setHistory, setLatestResult, setReputation, setMessage);
};
