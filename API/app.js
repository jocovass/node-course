const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//creating server
const app = express();
//express middleware for modifing the incomeing request
//so that we have access to the requerst body which is not included in express by default
app.use(express.json());
//middleware for serving public files
app.use(express.static('public'));

//THIRD party middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//creating CUSTOME middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//setting up some ROUTES
//GET request with params
//we can have more params or even optional params ":id?"
// app.get('/api/v1/tours/:id', getTour);
// app.get('/api/v1/tours', getAllTours);
// // //POST request
// app.post('/api/v1/tours', createTour);
// //PATCH request
// app.patch('/api/v1/tours/:id', updateTour);
// //DELETE request
// app.delete('/api/v1/tours/:id', deleteTour);

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
