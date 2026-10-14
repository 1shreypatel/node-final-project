const express = require('express');
const {registerPaymentController,loginPaymentController,fetchingPaymentController,fetchingSingelPaymentController,editPaymentController,processPaymentController,getMyPaymentHistoryController,getAllPaymentsAdminControlle} = require('../../controller/payment/paymentController');
const { verifyToken, authorizeRoles } = require('../../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerPaymentController);
router.post('/login', loginPaymentController);
router.get('/', fetchingPaymentController);
router.get('/:id', fetchingSingelPaymentController);
router.put('/:id', editPaymentController);

router.post('/process', verifyToken, authorizeRoles('player'), processPaymentController);
router.get('/history', verifyToken, authorizeRoles('player'), getMyPaymentHistoryController);
router.get('/admin/all', verifyToken, authorizeRoles('admin'), getAllPaymentsAdminController);

module.exports = router;
