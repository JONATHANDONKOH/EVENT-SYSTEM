const pool = require('../Config/db');

async function createInterest(name) {
  const result = await pool.query(
    `INSERT INTO interests (name) VALUES ($1) RETURNING id, name, created_at`,
    [name]
  );
  return result.rows[0];
}

async function getAllInterests() {
  const result = await pool.query(
    `SELECT id, name, created_at FROM interests ORDER BY name ASC`
  );
  return result.rows;
}

async function getInterestById(id) {
  const result = await pool.query(
    `SELECT id, name, created_at FROM interests WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

async function updateInterest(id, name) {
  const result = await pool.query(
    `UPDATE interests SET name = $1 WHERE id = $2 RETURNING id, name, created_at`,
    [name, id]
  );
  return result.rows[0];
}

async function deleteInterest(id) {
  const result = await pool.query(
    `DELETE FROM interests WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows[0];
}

module.exports = {
  createInterest,
  getAllInterests,
  getInterestById,
  updateInterest,
  deleteInterest,
};