const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'wcdmocol',
  database: 'tarea_agencia_tailwind',
});

// API Endpoints
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clients', async (req, res) => {
  const { name, contact, email, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO clients (name, contact, email, status) VALUES (?, ?, ?, ?)',
      [name, contact, email, status]
    );
    res.status(201).json({ id: result.insertId, name, contact, email, status });
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact, email, status } = req.body;
  try {
    await pool.query(
      'UPDATE clients SET name = ?, contact = ?, email = ?, status = ? WHERE id = ?',
      [name, contact, email, status, id]
    );
    res.json({ id, name, contact, email, status });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.emit('notification', { message: 'Bienvenido al sistema de notificaciones' });

  socket.on('taskUpdated', (data) => {
    console.log('Tarea actualizada:', data);
    io.emit('taskNotification', { message: `La tarea ${data.taskId} fue actualizada.` });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});