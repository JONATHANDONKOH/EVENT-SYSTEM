const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // your Neon connection string
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

module.exports = pool;