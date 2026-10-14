const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    enrollmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enrollment',
        required: true
    },
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGateway: {
        type: String,
        default: 'MockGateway' 
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'failed', 'pending'],
        default: 'pending'
    },
    paidAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
