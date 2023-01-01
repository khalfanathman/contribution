// const fs = require('fs');
const express = require('express');
const contribController = require('../controllers/contributionsController');
const authController = require('../controllers/authController');
const transactRouter = require('./transactionsRouter');
const userRoutes = require('./userRoutes');

const router = express.Router();

router
  .route('/events-within/:distance/center/:latlng/unit/:unit')
  .get(contribController.getContribsWithin);
// const router = express.Router({ mergeParams: true });
//route to get users in a specific contribution
router.use('/:contrib_id/users', userRoutes);
//route to get transactions on speecific contribution
// /contributions/${contrib.id}/transactions
router.use('/:contribId/transactions', transactRouter);

// router.param('contribution_ID', contribController.checkID);
router.route('/contrib_stats').get(contribController.getContribsStats);
router.route('/monthlyplan/:year').get(contribController.getMontlyPlan);
router
  .route('/')
  .get(contribController.getAllContributions)
  .post(
    authController.protect,
    authController.restrictTo(
      'admin',
      'secretary',
      'treasurer',
      'chairman',
      'viceChair',
      'orgSec'
    ),
    contribController.createContribution
  );
router
  .route('/:id')
  .get(contribController.getOneContribution)
  .patch(
    authController.protect,
    authController.restrictTo(
      'admin',
      'secretary',
      'treasurer',
      'chairman',
      'viceChair',
      'orgSec'
    ),
    contribController.updateContribution
  )
  .delete(
    authController.protect,
    authController.restrictTo(
      'admin',
      'secretary',
      'treasurer',
      'chairman',
      'viceChair',
      'orgSec'
    ),
    contribController.deleteContribution
  );

module.exports = router;
