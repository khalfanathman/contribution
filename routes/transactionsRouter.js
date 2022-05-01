const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router
  .route('/')
  .get(transactionController.getAlltransactions)
  .post(transactionController.createtransaction);
router
  .route('/:trans_ID')
  .get(transactionController.getOnetransaction)
  .patch(transactionController.updatetransaction)
  .delete(transactionController.deletetransaction);

module.exports = router;
