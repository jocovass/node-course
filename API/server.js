const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
  .then(() => console.log('DB connection successful!'));

//listening on port 3000
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App, running on port ${port}`);
});
