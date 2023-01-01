const express = require('express');
const benefController = require('../controllers/benefController');

const router = express.Router({ mergeParams: true });
// router.patch('/:dependId', dependantsController.getAllBeneficiaries);
router
  .route('/')
  .get(benefController.getAllBeneficiaries)
  .post(benefController.createBeneficiary);
router
  .route('/:id')
  .get(benefController.getAllBeneficiaries)
  .patch(benefController.updateBeneficiary)
  .delete(benefController.deleteBeneficiary);

module.exports = router;
