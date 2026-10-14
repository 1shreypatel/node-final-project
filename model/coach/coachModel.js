const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    specialization: {
        type: String,
        required: [true, 'Specialization is required']
    },
    qualification: {
        type: String,
        required: [true, 'Qualification is required']
    },
    experience: {
        type: Number, 
        required: [true, 'Experience in years is required']
    },
    bio: {
        type: String,
        default: ''
    },
    profileimage: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Coach = mongoose.model('Coach', coachSchema);
module.exports = Coach;
