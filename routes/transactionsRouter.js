const express = require('express');
const transactionController = require('../controllers/transactionController');
const viewController = require('../controllers/viewsController');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');

// router.use('/access_token', transactionController.getAccestoken);
// router.use(authController.protect);

// router.use('/access_token', transactionController.getAccestoken);
// router.use(transactionController.getAccestoken);
router.use(
  // '/',
  // authController.protect,
  transactionController.setUserId,
  // transactionController.lipanampesa,
  // transactionController.sleepTime,
  // viewController.getResponse,
  transactionController.createTransaction
);
router.use(
  '/simulate',
  transactionController.validate,
  transactionController.confirm,
  transactionController.simulate
);

router.use('/confirmation', transactionController.confirm);
router.use('/validation', transactionController.validate);
router.use('/balance', transactionController.balance);
router.use('/time_out', transactionController.timeout);
// router
//   .route('/lipanampesa')
//   .post(

//   );
// router.use('/lipanampesa', transactionController.lipanampesa);
router.use('/lipaNaMpesaQuery', transactionController.lipaNaMpesaQuery);
router.use(
  '/register',
  transactionController.getAccestoken,
  transactionController.registerUrl
);
router
  .route('/:id')
  .get(transactionController.getOneTransaction)
  .patch(
    authController.restrictTo(
      'member',
      'admin',
      'secretary',
      'treasurer',
      'chairman',
      'viceChair',
      'orgSec'
    ),
    transactionController.updateTransaction
  )
  .delete(
    authController.restrictTo(
      'member',
      'admin',
      'secretary',
      'treasurer',
      'chairman',
      'viceChair',
      'orgSec'
    ),
    transactionController.deleteTransaction
  );

module.exports = router;
