const mongoose = require('mongoose');
const dotenv = require('dotenv');

// const { randomObject } = require('./models/contributionsModel');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DB_LOCAL = process.env.DATABASE_LOCAL;

if (process.env.NODE_ENV === 'development') {
  console.log('Before CONNECTION SUCCESSFUL');
  mongoose
    .connect(DB_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log('DB CONNECTION SUCCESSFUL');
      // console.log(randomObject);
    });
}

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
    })
    .then((con) => {
      console.log('DB CONNECTION SUCCESSFUL');
    });
}

const port = process.env.port || 3000;
app.listen(port, () => {
  // console.log(DB);
  console.log(`App running on port ${port}`);
});
