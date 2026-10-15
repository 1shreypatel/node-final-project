const express = require('express');
const {registerUserController,fetchingUserController,fetchingSingelUserController,editUserController,getAllUsersController,updateUserStatusController,updateUserRoleController,deleteUserController} = require('../../controller/user/userController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUserController);
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsersController);
router.get('/:id', verifyToken, fetchingSingelUserController);
router.put('/:id', verifyToken, editUserController);
router.put('/:userId/status', verifyToken, authorizeRoles('admin'), updateUserStatusController);
router.put('/:userId/role', verifyToken, authorizeRoles('admin'), updateUserRoleController);
router.delete('/:userId', verifyToken, authorizeRoles('admin'), deleteUserController);

module.exports = router;
