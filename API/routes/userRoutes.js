const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgetPasword,
  resetPassWord,
  updatePassword,
} = require('../controllers/authController');

//USERS
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPasword);
router.patch('/resetPassword/:token', resetPassWord);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
