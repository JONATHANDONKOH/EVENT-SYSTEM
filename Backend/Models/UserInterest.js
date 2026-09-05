const pool = require('../Config/db');

async function addInterest(userId, interestId) {
  const result = await pool.query(
    `INSERT INTO user_interests (user_id, interest_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, interest_id) DO NOTHING
     RETURNING user_id, interest_id, created_at`,
    [userId, interestId]
  );
  return result.rows[0] || null;
}

async function addMultipleInterests(userId, interestIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify every interest ID actually exists before inserting any
    const checkResult = await client.query(
      `SELECT id FROM interests WHERE id = ANY($1::uuid[])`,
      [interestIds]
    );
    const validIds = new Set(checkResult.rows.map((r) => r.id));
    const invalidIds = interestIds.filter((id) => !validIds.has(id));

    if (invalidIds.length > 0) {
      throw new Error(`Invalid interest IDs: ${invalidIds.join(', ')}`);
    }

    for (const interestId of interestIds) {
      await client.query(
        `INSERT INTO user_interests (user_id, interest_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, interest_id) DO NOTHING`,
        [userId, interestId]
      );
    }

    await client.query('COMMIT');
    return getInterestsByUserId(userId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getInterestsByUserId(userId) {
  const result = await pool.query(
    `SELECT i.id, i.name, ui.created_at
     FROM user_interests ui
     JOIN interests i ON ui.interest_id = i.id
     WHERE ui.user_id = $1
     ORDER BY ui.created_at ASC`,
    [userId]
  );
  return result.rows;
}

async function deleteInterest(userId, interestId) {
  const result = await pool.query(
    `DELETE FROM user_interests
     WHERE user_id = $1 AND interest_id = $2
     RETURNING user_id, interest_id`,
    [userId, interestId]
  );
  return result.rows[0] || null;
}

async function deleteAllUserInterests(userId) {
  const result = await pool.query(
    `DELETE FROM user_interests WHERE user_id = $1 RETURNING interest_id`,
    [userId]
  );
  return result.rows;
}

async function replaceUserInterests(userId, interestIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const checkResult = await client.query(
      `SELECT id FROM interests WHERE id = ANY($1::uuid[])`,
      [interestIds]
    );
    const validIds = new Set(checkResult.rows.map((r) => r.id));
    const invalidIds = interestIds.filter((id) => !validIds.has(id));

    if (invalidIds.length > 0) {
      throw new Error(`Invalid interest IDs: ${invalidIds.join(', ')}`);
    }

    await client.query(`DELETE FROM user_interests WHERE user_id = $1`, [userId]);

    for (const interestId of interestIds) {
      await client.query(
        `INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2)`,
        [userId, interestId]
      );
    }

    await client.query('COMMIT');
    return getInterestsByUserId(userId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  addInterest,
  addMultipleInterests,
  getInterestsByUserId,
  deleteInterest,
  deleteAllUserInterests,
  replaceUserInterests,
};