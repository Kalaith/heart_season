import { apiClient } from '../apiClient';
import { CharacterSummary } from '../../types/game';

export const fetchCast = async (): Promise<CharacterSummary[]> => {
  const response = await apiClient.get<{ success: boolean; data: CharacterSummary[] }>('/api/cast');
  return response.data.data;
};
