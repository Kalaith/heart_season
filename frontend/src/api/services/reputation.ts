import { apiClient } from '../apiClient';
import { ReputationState } from '../../types/game';

export const fetchReputation = async (): Promise<ReputationState> => {
  const response = await apiClient.get<{ success: boolean; data: ReputationState }>('/api/reputation');
  return response.data.data;
};
