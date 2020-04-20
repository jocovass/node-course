const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty.'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.'],
      max: [5, 'Rating must be belove 5.'],
    },
    createdAt: {
      type: String,
      defualt: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAvergaeRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAvergaeRatings(this.tour);
});

//For findByIdAndUpdate and findByIdandDelete does have no access to documentum middleware, just to the query middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  //here the this keyword points to the current query and not to the current document
  this.r = await this.findOne();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAvergaeRatings(this.r.tour);
});

//THIS IS A ALTERNATIVE FOR THE CODE ABOVE
//because in a post middleware the callback function gets the document we serched for as an argument
// reviewSchema.post(/^findOneAnd/, async function(doc, next) {
//   await doc.constructor.calcAverageRating(doc.tour);
//   next();
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
