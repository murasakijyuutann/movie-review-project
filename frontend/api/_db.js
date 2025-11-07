import { createPool } from 'mysql2/promise';
import fs from 'fs';

let _pool;

export function db() {
  if (_pool) return _pool;

  const ssl =
    process.env.DB_SSL === 'true'
      ? (process.env.DB_SSL_CA_PATH
          ? { ca: fs.readFileSync(process.env.DB_SSL_CA_PATH) }
          : { minVersion: 'TLSv1.2' })
      : undefined;

  _pool = createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    ssl,
  });

  return _pool;
}
