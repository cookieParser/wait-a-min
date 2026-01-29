const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    waitTimeReported: { type: Number, required: true }, // e.g., 10, 20, 45 (midpoints or raw values)
    waitTimeRange: { type: String, required: true }, // "10-30 min"
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
