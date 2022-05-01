const express = require('express');
const welfareController = require('../controllers/welfareController');

const router = express.Router();

router
  .route('/')
  .get(welfareController.getAllWgroups)
  .post(welfareController.createWgroup);
router
  .route('/:welfare_ID')
  .get(welfareController.getOneWgroup)
  .patch(welfareController.updateWgroup)
  .delete(welfareController.deleteWgroup);

module.exports = router;
