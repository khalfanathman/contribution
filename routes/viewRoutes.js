const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.isLoggedIn);
router.get('/', viewController.landingpage);
router.get('/contributions/:id', viewController.getOneContribution);
router.use('/resultrans', viewController.getResponse);
router.get('/login', viewController.loginMember);

// router.use(authController.protect);
router.use(
  '/dependants/:memberId',
  authController.protect,
  viewController.getDependents
);
router.use(
  '/dependant/:dependantId',
  authController.protect,
  viewController.getDependent
);
router.use('/dependant/', viewController.DependentForm);
router.use(
  '/beneficiaries/:user_id',
  authController.protect,
  viewController.getBeneficiaries
);
router.use('/members', authController.isLoggedIn, viewController.getMembers);
router.use(
  '/savings',
  authController.isLoggedIn,
  authController.protect,
  viewController.getSavings
);

router.get('/me', viewController.getAccount);
router.get('/contribute', viewController.makeContribution);
router.get('/submit-user-data', viewController.updateMemberData);
module.exports = router;
