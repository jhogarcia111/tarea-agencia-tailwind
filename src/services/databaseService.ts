import apiClient from '@/context/connection';

export const testDatabaseConnection = async () => {
  const response = await apiClient.get('/api/test');
  return response.data;
};