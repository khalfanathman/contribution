const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/erroController');
const contributionRouter = require('./routes/contributionRoutes');
const userRouter = require('./routes/userRoutes');
const transactionsRouter = require('./routes/transactionsRouter');
const transtypeRouter = require('./routes/transactiontypeRouter');
const dependantsRouter = require('./routes/dependantsRouter');
const beneficiaryRouter = require('./routes/beneficiaryRouter');
const paymentRouter = require('./routes/paymentRouter');
const welfareRouter = require('./routes/welfareRouter');
const viewsRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    // whitelist: [
    //   'duration',
    //   'ratingsQuantity',
    //   'ratingsAverage',
    //   'maxGroupSize',
    //   'difficulty',
    //   'price',
    // ],
  })
);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROTES
app.use('/', viewsRouter);
app.use('/api/v1/contributions', contributionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dependents', dependantsRouter);
app.use('/api/v1/beneficiaries', beneficiaryRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/transtypes', transtypeRouter);
app.use('/api/v1/welfares', welfareRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
//START SERVER
module.exports = app;
