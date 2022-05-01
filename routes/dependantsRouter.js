const express = require('express');
const dependantsController = require('../controllers/dependantsController');

const router = express.Router();

router
  .route('/')
  .get(dependantsController.getAlldependants)
  .post(dependantsController.createdependants);
router
  .route('/:dependants_ID')
  .get(dependantsController.getOnedependants)
  .patch(dependantsController.updatedependants)
  .delete(dependantsController.deletedependants);

module.exports = router;
