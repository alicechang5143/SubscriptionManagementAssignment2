const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { createPlan, getPlans, updatePlan, deletePlan, getPlanTypes } = require('../controllers/planController');

router.get('/types', getPlanTypes);
router.get('/', getPlans);
router.post('/', protect, adminOnly, createPlan);
router.put('/:id', protect, adminOnly, updatePlan);
router.delete('/:id', protect, adminOnly, deletePlan);

module.exports = router;
