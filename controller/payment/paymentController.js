const Payment = require('../../model/payment/paymentModel');
const Enrollment = require('../../model/enrollment/enrollmentModel');
const TrainingProgram = require('../../model/trainingProgram/trainingProgramModel');
const User = require('../../model/user/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const registerPaymentController = async (req, res) => {
    try {
        const { enrollmentId, amount, paymentGeteway, transactionId, status, paidAt } = req.body;

        const payment = await Payment.create({
            enrollmentId,
            playerId: req.user?._id,
            programId: req.body.programId,
            amount,
            paymentGateway: paymentGeteway || 'MockGateway',
            transactionId: transactionId || 'TXN_' + Date.now(),
            status: status || 'completed',
            paidAt: paidAt || new Date()
        });

        console.log('Payment Successfully.', payment);
        return res.status(201).json({ message: 'Payment Successfully.', data: payment });

    } catch (error) {
        console.log('Error While Register Payment.', error);
        return res.status(500).json({ message: 'Error While Register Payment.', error: error.message });
    }
};

const loginPaymentController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User Not Found.');
            return res.status(404).json({ message: 'User Not Found.', data: null });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password Is Not Match.');
            return res.status(401).json({ message: 'Password Not Match.', data: null });
        }

        console.log('User Login Successfully.', user);
        return res.status(200).json({ message: 'User Login Successfully.', data: user });

    } catch (error) {
        console.log('Error While Login Payment.', error);
        return res.status(500).json({ message: 'Error While Login Payment.', error: error.message });
    }
};

const fetchingPaymentController = async (req, res) => {
    try {
        const payment = await Payment.find().populate('playerId', 'name email').populate('programId', 'name');

        if (!payment || payment.length === 0) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching Successfully.', payment);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: payment });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const fetchingSingelPaymentController = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findById(id).populate('playerId', 'name email').populate('programId', 'name');

        if (!payment) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        console.log('User Fetching successfully.', payment);
        return res.status(200).json({ message: 'User Fetching Successfully.', data: payment });

    } catch (error) {
        console.log('Error While Fetching User.', error);
        return res.status(500).json({ message: 'Error While Fetching User.', error: error.message });
    }
};

const editPaymentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { enrollmentId, amount, paymentGeteway, transactionId, status, paidAt } = req.body;

        const payment = await Payment.findByIdAndUpdate(id, {
            enrollmentId, amount, paymentGateway: paymentGeteway, transactionId, status, paidAt
        }, {
            new: true,
            runValidators: true
        });

        if (!payment) {
            console.log('Data not found.');
            return res.status(404).json({ message: 'Data not found.', data: null });
        }

        console.log('User Edit successfully.', payment);
        return res.status(200).json({ message: 'User Edit Successfully.', data: payment });

    } catch (error) {
        console.log('Error While Editing User.', error);
        return res.status(500).json({ message: 'Error While Editing User.', error: error.message });
    }
};

const processPaymentController = async (req, res) => {
    try {
        const playerId = req.user._id;
        const { enrollmentId, paymentGateway, simulateSuccess } = req.body;

        const enrollment = await Enrollment.findOne({ _id: enrollmentId, playerId });
        if (!enrollment) return res.status(404).json({ message: 'Enrollment record not found.' });
        if (enrollment.paymentStatus === 'completed') return res.status(400).json({ message: 'Payment already completed.' });

        const program = await TrainingProgram.findById(enrollment.programId);
        if (!program) return res.status(404).json({ message: 'Program not found.' });

        const isSuccess = simulateSuccess !== undefined ? Boolean(simulateSuccess) : true;
        const txnId = 'TXN_' + crypto.randomBytes(8).toString('hex').toUpperCase();

        if (isSuccess) {
            enrollment.paymentStatus = 'completed';
            await enrollment.save();

            const paymentRecord = await Payment.create({
                enrollmentId: enrollment._id,
                playerId,
                programId: program._id,
                amount: program.fee,
                paymentGateway: paymentGateway || 'MockGateway',
                transactionId: txnId,
                status: 'completed',
                paidAt: new Date()
            });

            return res.status(200).json({ message: 'Payment Successful! Access granted.', paymentStatus: 'completed', data: paymentRecord });
        } else {
            enrollment.paymentStatus = 'failed';
            await enrollment.save();

            const paymentRecord = await Payment.create({
                enrollmentId: enrollment._id,
                playerId,
                programId: program._id,
                amount: program.fee,
                paymentGateway: paymentGateway || 'MockGateway',
                transactionId: txnId,
                status: 'failed'
            });

            return res.status(400).json({ message: 'Payment Failed. You can retry payment.', paymentStatus: 'failed', data: paymentRecord });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Error Processing Payment.', error: error.message });
    }
};

const getMyPaymentHistoryController = async (req, res) => {
    try {
        const playerId = req.user._id;
        const payments = await Payment.find({ playerId }).populate('programId', 'name fee image').sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Payment History Retrieved.', count: payments.length, data: payments });
    } catch (error) {
        return res.status(500).json({ message: 'Error Fetching Payment History.', error: error.message });
    }
};

const getAllPaymentsAdminController = fetchingPaymentController;

module.exports = {registerPaymentController,loginPaymentController,fetchingPaymentController,fetchingSingelPaymentController,editPaymentController,processPaymentController,getMyPaymentHistoryController,getAllPaymentsAdminControlle};
