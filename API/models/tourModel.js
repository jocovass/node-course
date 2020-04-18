const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

//this is a schem for our tour collection
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name!'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal then 40 characters.',
      ],
      minlength: [
        10,
        'A tour name must have more or equal then 10 characters.',
      ],
      //   validate: [validator.isAlpha, 'Tour name must only contain characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration!'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size!'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty!'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.'],
      max: [5, 'Rating must be belove 5.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price!'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // the THIS only points to the current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description!'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image!'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(), // mongo will convert milliseconds into timestamp
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // mongoDB uses a special format GeoJSON for geolocational data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      adress: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          defualt: 'Point',
          enum: ['Point'],
          coordinates: [Number],
          adress: String,
          description: String,
          day: Number,
        },
      },
    ],
    //This is a special mongoDB type "ObjectId" to tell mongo we are referencing documents by their ID and we give the refrence to the collection where we want to reference the documents from
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    // on the schema we can specify a second argument object to tell mongoDB when to add the virtual property to our data
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES when we dont want to save a data into the DB but we want int to be included whenever the user requests our tour.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE will act on the currently proccessed document
//run before the .save(), and .create() commands but not on the .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//We can embed guides trough this PRE middleware function by fetching the persons with their ID
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = await this.guides.map(
//     async (id) => await User.findById(id)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

/*tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});*/

//this run after .pre() middleware, we don't have the this keyword anymore but we have the ready saved doc
/*tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
});*/

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
