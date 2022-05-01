const express = require('express');
const morgan = require('morgan');
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

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//ROTES

app.use('/api/v1/contributions', contributionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/dependants', dependantsRouter);
app.use('/api/v1/benefciaries', beneficiaryRouter);
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
