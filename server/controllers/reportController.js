const { z } = require('zod');
const Report = require('../models/Report');
const Place = require('../models/Place');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const reportSchema = z.object({
    placeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Place ID'),
    waitTimeRange: z.enum(['0-10 min', '10-30 min', '30-60 min', '60+ min'])
});

exports.submitReport = catchAsync(async (req, res, next) => {
    // 1. Validate Input
    const validatedData = reportSchema.parse(req.body);
    const { placeId, waitTimeRange } = validatedData;

    const place = await Place.findById(placeId);
    if (!place) return next(new AppError('No place found with that ID', 404));

    // Convert range string to average number
    let waitTimeVal = 0;
    if (waitTimeRange === '0-10 min') waitTimeVal = 5;
    else if (waitTimeRange === '10-30 min') waitTimeVal = 20;
    else if (waitTimeRange === '30-60 min') waitTimeVal = 45;
    else if (waitTimeRange === '60+ min') waitTimeVal = 75;

    const report = await Report.create({
        placeId,
        waitTimeRange,
        waitTimeReported: waitTimeVal
    });

    // Trigger Aggregation (Recalculate Place stats)
    await recalculatePlaceStats(placeId, req.app.get('socketio'));

    res.status(201).json({
        status: 'success',
        data: report
    });
});

async function recalculatePlaceStats(placeId, io) {
    // Fetch recent reports (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const reports = await Report.find({
        placeId,
        timestamp: { $gte: twoHoursAgo }
    });

    if (reports.length === 0) return;

    // Calculate Average
    const total = reports.reduce((acc, r) => acc + r.waitTimeReported, 0);
    const avg = Math.round(total / reports.length);

    // Confidence & Crowd Level
    let confidence = 'Low';
    let crowd = 'Low';

    if (reports.length >= 5) confidence = 'Medium';
    if (reports.length >= 10) confidence = 'High';

    if (avg < 15) crowd = 'Low';
    else if (avg < 45) crowd = 'Medium';
    else crowd = 'High';

    await Place.findByIdAndUpdate(placeId, {
        currentWaitTime: avg,
        crowdLevel: crowd,
        confidenceLevel: confidence,
        lastUpdated: new Date()
    });

    // Real-time Update
    if (io) {
        io.to(placeId.toString()).emit('waitTimeUpdated', {
            placeId: placeId.toString(),
            currentWaitTime: avg,
            crowdLevel: crowd,
            confidenceLevel: confidence,
            lastUpdated: new Date()
        });
    }
}
