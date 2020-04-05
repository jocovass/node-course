const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//creating server
const app = express();
//express midleware for modifing the incomeing request
//so that we have access to the requerst body which is not included in express by default
app.use(express.json());
//midleware for serving public files
app.use(express.static('public'));

//THIRD party midleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//creating CUSTOME midleware
app.use((req, res, next) => {
  console.log('Hello from the midleware.');
  next();
});
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

module.exports = app;
