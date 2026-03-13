import { apiClient } from '../apiClient';
import { SubmissionPayload } from '../../types/game';

export const fetchCurrentSubmission = async (): Promise<SubmissionPayload | null> => {
  const response = await apiClient.get<{ success: boolean; data: SubmissionPayload | null }>('/api/round/current/submission');
  return response.data.data;
};

export const submitRoundPlan = async (payload: SubmissionPayload): Promise<void> => {
  await apiClient.post('/api/round/current/submission', payload);
};

export const updateRoundPlan = async (payload: SubmissionPayload): Promise<void> => {
  await apiClient.put('/api/round/current/submission', payload);
};
