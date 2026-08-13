const express = require('express');
const router = express.Router({ mergeParams: true });
const { getProductReviews, createProductReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

module.exports = router;
