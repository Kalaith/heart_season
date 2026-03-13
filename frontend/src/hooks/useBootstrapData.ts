import { useEffect } from 'react';
import { fetchCast } from '../api/services/cast';
import { fetchReputation } from '../api/services/reputation';
import { fetchRoundHistory, fetchLatestResults } from '../api/services/rounds';
import { fetchCurrentSeason } from '../api/services/season';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';

export const useBootstrapData = (): void => {
  const { setSeasonState, setCast, setHistory, setLatestResult, setReputation } = useGameStore();
  const setMessage = useUiStore((state) => state.setMessage);

  useEffect(() => {
    const load = async () => {
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

    void load();
  }, [setCast, setHistory, setLatestResult, setMessage, setReputation, setSeasonState]);
};
