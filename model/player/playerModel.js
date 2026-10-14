const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Gender is required']
    },
    sportPreference: {
        type: String, 
        required: [true, 'Sport Preference is required']
    },
    experienceLevel: {
        type: String, 
        required: [true, 'Experience Level is required']
    },
    profileimage: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
