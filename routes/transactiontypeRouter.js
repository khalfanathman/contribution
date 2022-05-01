const express = require('express');
const transactiontypeController = require('../controllers/transactiontypeController');

const router = express.Router();

router
  .route('/')
  .get(transactiontypeController.getAlltranstypse)
  .post(transactiontypeController.createtranstype);
router
  .route('/:transtype_ID')
  .get(transactiontypeController.getOnetranstype)
  .patch(transactiontypeController.updatetranstype)
  .delete(transactiontypeController.deletetranstype);

module.exports = router;
