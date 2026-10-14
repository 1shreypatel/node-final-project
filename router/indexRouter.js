const express = require('express');

const authRouter = require('./auth/authRouter');
const userRouter = require('./user/userRouter');
const coachRouter = require('./coach/coachRouter');
const playerRouter = require('./player/playerRouter');
const sportRouter = require('./sport/sportRouter');
const trainingProgramRouter = require('./trainingProgram/trainingProgramRouter');
const trainingRouter = require('./training/trainingRouter');
const enrollmentRouter = require('./enrollment/enrollmentRouter');
const paymentRouter = require('./payment/paymentRouter');
const sessionRouter = require('./session/sessionRouter');

const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({
        message: 'File uploaded successfully.',
        fileUrl,
        filename: req.file.filename
    });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/coach', coachRouter);
router.use('/player', playerRouter);
router.use('/sports', sportRouter);
router.use('/programs', trainingProgramRouter);
router.use('/sessions', trainingRouter);
router.use('/enrollments', enrollmentRouter);
router.use('/payments', paymentRouter);
router.use('/progress', sessionRouter);

module.exports = router;
