const express = require('express');
const {registerController,loginUserController,fetchingAuthController,fetchingSingelAuthController,editAuthController,getMeController} = require('../../controller/authController/authController');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginUserController);
router.get('/', fetchingAuthController);
router.get('/me', verifyToken, getMeController);
router.get('/:id', fetchingSingelAuthController);
router.put('/:id', editAuthController);

module.exports = router;
