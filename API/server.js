const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//listening on port 3000
const port = process.env.PORT;
app.listen(port, () => {
  console.log('App, running on port ' + port);
});
