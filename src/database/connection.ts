import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost', // Cambia esto por la dirección de tu servidor MySQL
  user: 'root', // Cambia esto por tu usuario de MySQL
  password: 'password', // Cambia esto por tu contraseña de MySQL
  database: 'nombre_base_datos', // Cambia esto por el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;