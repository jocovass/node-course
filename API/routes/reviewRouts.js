const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createReview,
  getAllReviews,
  getOneReview,
  updateReview,
  deleteTour,
} = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(getAllReviews).post(protect, createReview);
router
  .route('/:id')
  .get(getOneReview)
  .patch(protect, updateReview)
  .delete(protect, deleteTour);

module.exports = router;
