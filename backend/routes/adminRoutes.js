const express = require('express');
const router = express.Router();
const { getDashboardStats, getCustomers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/isAdmin');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);

module.exports = router;
