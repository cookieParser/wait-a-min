const { z } = require('zod');
const Place = require('../models/Place');
const Report = require('../models/Report');
const { generateInsights } = require('../utils/aiInsights');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Validation Schemas
const updateWaitTimeSchema = z.object({
    waitTime: z.number().min(0, 'Wait time cannot be negative').max(300, 'Wait time too high')
});

// Get all places (with basic filter)
exports.getPlaces = catchAsync(async (req, res, next) => {
    const { type, city } = req.query;
    let query = {};
    if (type) query.type = type;
    if (city) query.city = new RegExp(city, 'i');

    const places = await Place.find(query).sort({ currentWaitTime: 1 });
    res.json({
        status: 'success',
        results: places.length,
        data: places
    });
});

// Get single place details + Aggregate Reports + Generate Insights
exports.getPlaceDetails = catchAsync(async (req, res, next) => {
    const place = await Place.findById(req.params.id);
    if (!place) return next(new AppError('Place not found', 404));

    // Fetch reports from last 3 hours
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const reports = await Report.find({
        placeId: place._id,
        timestamp: { $gte: threeHoursAgo }
    }).sort({ timestamp: -1 });

    // Generate Insights
    const insights = await generateInsights(place, reports);

    res.json({
        status: 'success',
        data: {
            ...place.toObject(),
            reportsCount: reports.length,
            recentReports: reports.slice(0, 5),
            insights
        }
    });
});

// Business Owner: Update Official Wait Time
exports.updateOfficialWaitTime = catchAsync(async (req, res, next) => {
    const validatedData = updateWaitTimeSchema.parse(req.body);
    const { waitTime } = validatedData;

    const place = await Place.findByIdAndUpdate(req.params.id, {
        officialWaitTime: waitTime,
        officialUpdateAt: new Date(),
        currentWaitTime: waitTime
    }, { new: true, runValidators: true });

    if (!place) return next(new AppError('Place not found', 404));

    // Emit socket event
    const io = req.app.get('socketio');
    if (io) {
        io.to(place._id.toString()).emit('waitTimeUpdated', {
            placeId: place._id.toString(),
            currentWaitTime: waitTime,
            type: 'official',
            lastUpdated: new Date()
        });
    }

    res.json({
        status: 'success',
        data: place
    });
});

// Create a Place (Seed/Admin)
exports.createPlace = catchAsync(async (req, res, next) => {
    const place = await Place.create(req.body);
    res.status(201).json({
        status: 'success',
        data: place
    });
});
