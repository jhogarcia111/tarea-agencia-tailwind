import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost', // Cambiar por la dirección de tu servidor MySQL
  user: 'root', // Cambiar por tu usuario de MySQL
  password: 'wcdmocol', // Cambiar por tu contraseña de MySQL
  database: 'tarea_agencia_tailwind', // Cambiar por el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;