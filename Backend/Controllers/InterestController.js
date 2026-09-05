const {
  createInterest,
  getAllInterests,
  getInterestById,
  updateInterest,
  deleteInterest,
} = require('../Models/Interest');

// @route POST /api/interests (admin only)
async function create(req, res) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'name is required' });
    }
    const interest = await createInterest(name.trim());
    res.status(201).json(interest);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Interest already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route GET /api/interests
async function getAll(req, res) {
  try {
    const interests = await getAllInterests();
    res.status(200).json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route GET /api/interests/:id
async function getOne(req, res) {
  try {
    const interest = await getInterestById(req.params.id);
    if (!interest) return res.status(404).json({ message: 'Interest not found' });
    res.status(200).json(interest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route PUT /api/interests/:id (admin only)
async function update(req, res) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'name is required' });
    }
    const interest = await updateInterest(req.params.id, name.trim());
    if (!interest) return res.status(404).json({ message: 'Interest not found' });
    res.status(200).json(interest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route DELETE /api/interests/:id (admin only)
async function remove(req, res) {
  try {
    const deleted = await deleteInterest(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Interest not found' });
    res.status(200).json({ message: 'Interest deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { create, getAll, getOne, update, remove };