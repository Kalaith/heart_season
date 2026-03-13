import { apiClient } from '../apiClient';
import { SeasonState } from '../../types/game';

export const fetchCurrentSeason = async (): Promise<SeasonState> => {
  const response = await apiClient.get<{ success: boolean; data: SeasonState }>('/api/season/current');
  return response.data.data;
};
