const { getUserFeed } = require('../services/feedService');

// @route GET /api/feed
async function getFeed(req, res) {
  try {
    const userId = req.user.id;
    const feed = await getUserFeed(userId);
    res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getFeed };