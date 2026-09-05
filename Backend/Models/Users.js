const bcrypt = require('bcrypt');
const pool = require('../Config/db');

async function createUser({ name, email, password, location }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, location)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, location, created_at`,
    [name, email, hashedPassword, location]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

async function comparePassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

module.exports = { createUser, findUserByEmail, comparePassword };