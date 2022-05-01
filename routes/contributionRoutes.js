// const fs = require('fs');
const express = require('express');
const contribController = require('../controllers/contributionsController');

const router = express.Router();
// router.param('contribution_ID', contribController.checkID);
router.route('/contrib_stats').get(contribController.getContribsStats);
router.route('/monthlyplan/:year').get(contribController.getMontlyPlan);
router
  .route('/')
  .get(contribController.getAllContributions)
  .post(contribController.createContribution);
router
  .route('/:contribution_ID')
  .get(contribController.getOneContribution)
  .patch(contribController.updateContribution)
  .delete(contribController.deleteContribution);

module.exports = router;
