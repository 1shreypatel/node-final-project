const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Sport category name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Sport = mongoose.model('Sport', sportSchema);
module.exports = Sport;
