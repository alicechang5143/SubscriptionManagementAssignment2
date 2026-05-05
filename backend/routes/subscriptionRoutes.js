const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createSubscription,
  getMySubscriptions,
  updateSubscription,
  cancelSubscription,
  renewSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');

router.use(protect);
router.post('/', createSubscription);
router.get('/', getMySubscriptions);
router.put('/:id', updateSubscription);
router.patch('/:id/cancel', cancelSubscription);
router.patch('/:id/renew', renewSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;
