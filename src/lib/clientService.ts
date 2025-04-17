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