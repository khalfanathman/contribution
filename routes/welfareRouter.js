const express = require('express');
const welfareController = require('../controllers/welfareController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect, authController.restrictTo('super-user'));
router
  .route('/')
  .get(welfareController.getAllWgroups)
  .post(welfareController.createWgroup);
router
  .route('/:id')
  .get(welfareController.getOneWgroup)
  .patch(welfareController.updateWgroup)
  .delete(welfareController.deleteWgroup);

module.exports = router;
