const {
  addMultipleInterests,
  getInterestsByUserId,
  deleteInterest,
  deleteAllUserInterests,
  replaceUserInterests,
} = require('../Models/UserInterest');
const { isValidUUID } = require('../utils/validateUUID');

function validateInterestIdsArray(interestIds) {
  if (!Array.isArray(interestIds) || interestIds.length === 0) {
    return 'interestIds must be a non-empty array';
  }
  const invalid = interestIds.filter((id) => !isValidUUID(id));
  if (invalid.length > 0) {
    return `Invalid UUID(s): ${invalid.join(', ')}`;
  }
  const duplicates = interestIds.length !== new Set(interestIds).size;
  if (duplicates) {
    return 'Duplicate interest IDs in request';
  }
  return null;
}

// @route GET /api/user/interests
async function getMine(req, res) {
  try {
    const userId = req.user.id;
    const interests = await getInterestsByUserId(userId);
    res.status(200).json(interests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route POST /api/user/interests
async function addMine(req, res) {
  try {
    const userId = req.user.id;
    const { interestIds } = req.body;

    const error = validateInterestIdsArray(interestIds);
    if (error) return res.status(400).json({ message: error });

    const interests = await addMultipleInterests(userId, interestIds);
    res.status(201).json(interests);
  } catch (err) {
    if (err.message?.startsWith('Invalid interest IDs')) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route PUT /api/user/interests
async function replaceMine(req, res) {
  try {
    const userId = req.user.id;
    const { interestIds } = req.body;

    const error = validateInterestIdsArray(interestIds);
    if (error) return res.status(400).json({ message: error });

    const interests = await replaceUserInterests(userId, interestIds);
    res.status(200).json(interests);
  } catch (err) {
    if (err.message?.startsWith('Invalid interest IDs')) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route DELETE /api/user/interests/:interestId
async function removeOne(req, res) {
  try {
    const userId = req.user.id;
    const { interestId } = req.params;

    if (!isValidUUID(interestId)) {
      return res.status(400).json({ message: 'Invalid interest ID' });
    }

    const deleted = await deleteInterest(userId, interestId);
    if (!deleted) return res.status(404).json({ message: 'Interest not found for this user' });

    res.status(200).json({ message: 'Interest removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// @route DELETE /api/user/interests
async function removeAll(req, res) {
  try {
    const userId = req.user.id;
    await deleteAllUserInterests(userId);
    res.status(200).json({ message: 'All interests removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getMine, addMine, replaceMine, removeOne, removeAll };