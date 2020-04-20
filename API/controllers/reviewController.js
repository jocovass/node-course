const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routs
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

//get all reviews
exports.getAllReviews = getAll(Review);
//get one review
exports.getOneReview = getOne(Review);
//create new review
exports.createReview = createOne(Review);
//update review
exports.updateReview = updateOne(Review);
//delete review
exports.deleteTour = deleteOne(Review);
