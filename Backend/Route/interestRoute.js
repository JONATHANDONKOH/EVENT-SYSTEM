const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { create, getAll, getOne, update, remove } = require('../Controllers/interestController');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, roleMiddleware('admin'), create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), remove);

module.exports = router;