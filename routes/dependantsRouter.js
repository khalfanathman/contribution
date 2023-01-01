const express = require('express');
const dependantsController = require('../controllers/dependantsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.use(authController.protect);
router.patch(
  '/:user_id/dependents/:dependId',
  dependantsController.updatedependant
);
router
  .route('/')
  .get(dependantsController.setUserId, dependantsController.getAlldependant)
  .post(dependantsController.setUserId, dependantsController.createdependant);
router
  .route('/:id')
  .get(dependantsController.getOnedependant)
  .patch(
    // authController
    // .restrictTo
    // 'admin',
    // 'secretary',
    // 'treasurer',
    // 'chairman',
    // 'viceChair',
    // 'orgSec'
    // (),
    dependantsController.updatedependant
  )
  .delete(dependantsController.deletedependant);

module.exports = router;
