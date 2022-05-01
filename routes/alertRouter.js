const express = require('express');
const alertController = require('../controllers/alertController');

const router = express.Router();

router
  .route('/')
  .get(alertController.getAllAlerts)
  .post(alertController.createAlert);
router
  .route('/:alert_ID')
  .get(alertController.getOneAlert)
  .patch(alertController.updateAlert)
  .delete(alertController.deleteAlert);

module.exports = router;
