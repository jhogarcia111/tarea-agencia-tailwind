import apiClient from '@/context/connection';
import axios from 'axios';

export const fetchClients = async () => {
  const response = await apiClient.get('/api/clients');
  return response.data;
};

export const fetchClientById = async (id) => {
  const response = await apiClient.get(`/api/clients/${id}`);
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

export const fetchTaskCountsByClient = async () => {
  const response = await axios.get('/api/tasks/count-by-client');
  return response.data;
};

export const fetchTaskCountsByUser = async () => {
  const response = await axios.get('/api/tasks/count-by-user');
  return response.data;
};

export const fetchClientTaskDistribution = async () => {
  const response = await apiClient.get('/api/clients/task-distribution');
  return response.data;
};

export const getAllNotifications = async () => {
  try {
    const response = await apiClient.get('/api/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Error fetching notifications');
  }
};