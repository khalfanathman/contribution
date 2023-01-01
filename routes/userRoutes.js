const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const dependantsRouter = require('./dependantsRouter');
const beneficiaryRouter = require('./beneficiaryRouter');
// const dependantsController = require('../controllers/dependantsController');

const router = express.Router();

router.use('/:user_id/dependents', dependantsRouter);
router.use('/:user_id/beneficiaries', beneficiaryRouter);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// protect all rotes after this middleware
// router.use(authController.protect);
router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getOneUser);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
// restrict routes to admin
// router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
// router
//   .route('/:id')
//   .get(userController.getOneUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
