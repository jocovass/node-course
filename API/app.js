const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//creating server
const app = express();
//express middleware for modifing the incomeing request
//so that we have access to the requerst body which is not included in express by default
app.use(express.json({ limit: '10kb' }));

//middleware for serving public files
app.use(express.static('public'));

//THIRD party middleware "logger"
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit the number of req. allowed from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Set security header metadata
app.use(helmet());

//Data sanitizastion against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevetn parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQueantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//creating CUSTOME middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't finde ${req.originalUrl} on this server!`,
    404
  );
  // if we pass any argument to the next() func express will know that some error happend so itt will skip all the following middleware and call the error handleing middleware
  next(err);
});

app.use(globalErrorController);

module.exports = app;
