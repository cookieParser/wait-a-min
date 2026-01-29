const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Clinic', 'Hospital', 'Restaurant', 'Government Office', 'Service Center', 'Other']
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If claimed

    // Aggregated Data (Updated periodically or on new report)
    currentWaitTime: { type: Number, default: 0 }, // in minutes
    crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    confidenceLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    lastUpdated: { type: Date, default: Date.now },

    // Official Update (Business Owner)
    officialWaitTime: { type: Number },
    officialUpdateAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Place', PlaceSchema);
