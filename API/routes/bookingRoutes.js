const express = require('express');
const {
  getCheckoutSession,
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').post(createBooking).get(getAllBooking);
router
  .route('/:id')
  .get(getOneBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = router;
