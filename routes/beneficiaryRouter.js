const express = require('express');
const benefController = require('../controllers/benefController');

const router = express.Router();

router
  .route('/')
  .get(benefController.getAllBeneficiaries)
  .post(benefController.createBeneficiary);
router
  .route('/:user_ID')
  .get(benefController.getOneBeneficiary)
  .patch(benefController.updateBeneficiary)
  .delete(benefController.deleteBeneficiary);

module.exports = router;
