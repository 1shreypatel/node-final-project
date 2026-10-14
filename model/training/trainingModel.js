const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: [true, 'Training Program ID is required']
    },
    title: {
        type: String,
        required: [true, 'Session title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number, 
        default: 1
    },
    duration: {
        type: String, 
        default: '60 mins'
    }
}, {
    timestamps: true
});

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);
module.exports = TrainingSession;
