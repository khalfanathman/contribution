const express = require('express');
const savingsController = require('../controllers/savingsController');

const router = express.Router();

router
  .route('/')
  .get(savingsController.getAllSavings)
  .post(savingsController.createUser);
router
  .route('/:id')
  .get(savingsController.getSavingns)
  .patch(savingsController.updateSavings)
  .delete(savingsController.deleteSavings);

module.exports = router;
