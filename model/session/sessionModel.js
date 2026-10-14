const mongoose = require('mongoose');

const sessionProgressSchema = new mongoose.Schema({
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
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingSession',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

sessionProgressSchema.index({ playerId: 1, sessionId: 1 }, { unique: true });

const SessionProgress = mongoose.model('SessionProgress', sessionProgressSchema);
module.exports = SessionProgress;
