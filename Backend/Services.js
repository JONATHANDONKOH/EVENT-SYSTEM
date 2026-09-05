const pool = require('../Config/db');

const WEIGHTS = {
  LOCATION_MATCH: 5,
  INTEREST_MATCH: 3,
};

async function getUserFeed(userId) {
  // 1. Get user's location
  const userResult = await pool.query(
    `SELECT location FROM users WHERE id = $1`,
    [userId]
  );
  if (userResult.rows.length === 0) {
    throw new Error('User not found');
  }
  const userLocation = userResult.rows[0].location;

  // 2. Get user's interest_ids
  const interestResult = await pool.query(
    `SELECT interest_id FROM user_interests WHERE user_id = $1`,
    [userId]
  );
  const userInterestIds = new Set(interestResult.rows.map((r) => r.interest_id));

  // 3. Get all events
  const eventsResult = await pool.query(`SELECT * FROM events`);
  const events = eventsResult.rows;

  // 4-5. Score each event
  const scoredEvents = events.map((event) => {
    let score = 0;

    // Location match
    if (event.location === userLocation) {
      score += WEIGHTS.LOCATION_MATCH;
    }

    // Interest match
    if (event.interest_id && userInterestIds.has(event.interest_id)) {
      score += WEIGHTS.INTEREST_MATCH;
    }

    return {
      ...event,
      score,
    };
  });

  // 6. Sort by score descending
  scoredEvents.sort((a, b) => b.score - a.score);

  // 7. Return as feed
  return scoredEvents;
}

module.exports = { getUserFeed };