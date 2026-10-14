const mongoose = require('mongoose');

const trainingProgramSchema = new mongoose.Schema({
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: [true, 'Sport category is required']
    },
    name: {
        type: String,
        required: [true, 'Program name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Program description is required']
    },
    difficultyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: [true, 'Difficulty level is required']
    },
    duration: {
        type: String, 
        required: [true, 'Duration is required']
    },
    requirements: {
        type: String, 
        default: 'None'
    },
    learningOutcomes: {
        type: String, 
        required: [true, 'Learning outcomes are required']
    },
    image: {
        type: String,
        default: ''
    },
    fee: {
        type: Number,
        default: 0 
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    rejectionReason: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

trainingProgramSchema.pre('save', function (next) {
    this.isPaid = this.fee > 0;
    next();
});

const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);
module.exports = TrainingProgram;
