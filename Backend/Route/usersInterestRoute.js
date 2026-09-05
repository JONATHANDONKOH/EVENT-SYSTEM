const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMine,
  addMine,
  replaceMine,
  removeOne,
  removeAll,
} = require('../Controllers/UserInterestController');

router.use(authMiddleware);

router.get('/', getMine);
router.post('/', addMine);
router.put('/', replaceMine);
router.delete('/:interestId', removeOne);
router.delete('/', removeAll);

module.exports = router;