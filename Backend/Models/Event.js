const pool = require('../Config/db');

async function createEvent({
  userId,
  interestId,
  title,
  description,
  eventDate,
  startTime,
  endTime,
  eventLocation,
  imageUrl,
  capacity,
}) {
  const result = await pool.query(
    `INSERT INTO events
      (user_id, interest_id, title, description, event_date, start_time, end_time, event_location, image_url, capacity)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [userId, interestId, title, description, eventDate, startTime, endTime, eventLocation, imageUrl, capacity]
  );
  return result.rows[0];
}

async function getEventById(eventId) {
  const result = await pool.query(
    `SELECT * FROM events WHERE event_id = $1`,
    [eventId]
  );
  return result.rows[0];
}

async function getEventsByUserId(userId) {
  const result = await pool.query(
    `SELECT * FROM events WHERE user_id = $1 ORDER BY event_date ASC, start_time ASC`,
    [userId]
  );
  return result.rows;
}

async function updateEvent(eventId, userId, fields) {
  const {
    title,
    description,
    interestId,
    eventDate,
    startTime,
    endTime,
    eventLocation,
    imageUrl,
    capacity,
  } = fields;

  const result = await pool.query(
    `UPDATE events
     SET title = $1,
         description = $2,
         interest_id = $3,
         event_date = $4,
         start_time = $5,
         end_time = $6,
         event_location = $7,
         image_url = $8,
         capacity = $9,
         updated_at = NOW()
     WHERE event_id = $10 AND user_id = $11
     RETURNING *`,
    [title, description, interestId, eventDate, startTime, endTime, eventLocation, imageUrl, capacity, eventId, userId]
  );
  return result.rows[0];
}

async function deleteEvent(eventId, userId) {
  const result = await pool.query(
    `DELETE FROM events WHERE event_id = $1 AND user_id = $2 RETURNING event_id`,
    [eventId, userId]
  );
  return result.rows[0];
}

module.exports = {
  createEvent,
  getEventById,
  getEventsByUserId,
  updateEvent,
  deleteEvent,
};