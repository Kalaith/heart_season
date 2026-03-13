import { apiClient } from '../apiClient';
import { PlayerResult, RoundSummary } from '../../types/game';

export const fetchRoundHistory = async (): Promise<RoundSummary[]> => {
  const response = await apiClient.get<{ success: boolean; data: RoundSummary[] }>('/api/round/history');
  return response.data.data;
};

export const fetchLatestResults = async (): Promise<PlayerResult | null> => {
  const response = await apiClient.get<{ success: boolean; data: PlayerResult | null }>('/api/round/results');
  return response.data.data;
};
