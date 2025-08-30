import apiClient from '@/context/connection';

export const getUsers = async () => {
  const response = await apiClient.get('/api/users');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error updating user');
  }
};

export const deleteUser = async (id) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new Error(`Invalid user ID: ${id}`);
    }

    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Server responded with status ${error.response.status}:`, error.response.data);
      if (error.response.status === 400) {
        throw new Error(`Bad Request: ${error.response.data.message || 'Invalid request'}`);
      }
    } else {
      console.error('Error deleting user:', error);
    }
    throw new Error('Error deleting user');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw new Error('Error fetching user details');
  }
};

