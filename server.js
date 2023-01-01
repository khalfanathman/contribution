const mongoose = require('mongoose');
const dotenv = require('dotenv');

// const { randomObject } = require('./models/contributionsModel');
process.on('uncaughtException', (err) => {
  console.log('UNcought exception!..Shutting Down....');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
const DB_LOCAL = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB CONNECTION SUCCESSFUL');
    // console.log(randomObject);
  });

// eslint-disable-next-line node/no-unsupported-features/es-syntax
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then((con) => {
//     console.log('DB CONNECTION SUCCESSFUL');
//   });

const port = process.env.port || 8000;
const server = app.listen(port, () => {
  // console.log(DB);
  console.log(`App running on  http://localhost:${port}/ server `);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLE REJECTION!..Shutting Down....');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
