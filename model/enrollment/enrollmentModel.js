const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
    enrollmentType: {
        type: String,
        enum: ['free', 'paid'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['completed', 'pending', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

enrollmentSchema.index({ playerId: 1, programId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;
