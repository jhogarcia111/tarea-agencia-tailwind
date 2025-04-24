import apiClient from '@/context/connection';

export const getClients = async () => {
  const response = await apiClient.get('/api/clients');
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await apiClient.post('/api/clients', clientData);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await apiClient.put(`/api/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await apiClient.delete(`/api/clients/${id}`);
  return response.data;
};