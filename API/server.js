const mongoose = require('mongoose');
const dotenv = require('dotenv');

// when uncaughtException happens in our application we must 'CRUSH' stop our app because after there was an uncaught exception the entire node process is in a so-called unclean state
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 SHUTTING DOWN...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// this is the url to connect to the atlas cluster
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// we are using mongoose a third party package to connect our mongoDB database that is hosted on atlas to our project
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

//listening on port 3000
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App, running on port ${port}`);
});

// each time there is an unhandled rejection somewhere in our application the process object will emit an event called unhandled rejection, we can subscribe to that event with process.on(), where we call server.close() -> by doing so we will tell the application to send respsonse to the hanging requests and after close the app calling process.exit().
process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION! 💥 SHUTTING DOWN...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
