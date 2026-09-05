const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getFeed } = require('../controllers/feedController');

router.get('/', authMiddleware, getFeed);

module.exports = router;