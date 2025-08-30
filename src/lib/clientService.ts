import axios from 'axios';

const API_URL = 'http://localhost:3001/api/clients';

// Obtener todos los clientes
export const fetchClients = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear un nuevo cliente
export const createClient = async (clientData) => {
  const response = await axios.post(API_URL, clientData);
  return response.data;
};

// Actualizar un cliente existente
export const updateClient = async (id, clientData) => {
  const response = await axios.put(`${API_URL}/${id}`, clientData);
  return response.data;
};

// Eliminar un cliente
export const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const fetchTaskCountsByClient = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/tasks/count-by-client'); // Ensure full URL is used
    if (
      response.status === 200 &&
      response.headers['content-type']?.includes('application/json') &&
      Array.isArray(response.data)
    ) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching task counts by client:', error);
    throw error;
  }
};

export const fetchTaskCountsByUser = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/tasks/count-by-user'); // Ensure full URL is used
    if (
      response.status === 200 &&
      response.headers['content-type']?.includes('application/json') &&
      Array.isArray(response.data)
    ) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching task counts by user:', error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/tasks');
    if (
      response.status === 200 &&
      response.headers['content-type']?.includes('application/json') &&
      Array.isArray(response.data)
    ) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTasksByUserId = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/tasks/user/${userId}`);
    if (
      response.status === 200 &&
      response.headers['content-type']?.includes('application/json') &&
      Array.isArray(response.data)
    ) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(`Error fetching tasks for user ID ${userId}:`, error);
    throw error;
  }
};

export const fetchTasksByClientId = async (clientId) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/tasks/client/${clientId}`);
    if (
      response.status === 200 &&
      response.headers['content-type']?.includes('application/json') &&
      Array.isArray(response.data)
    ) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(`Error fetching tasks for client ID ${clientId}:`, error);
    throw error;
  }
};