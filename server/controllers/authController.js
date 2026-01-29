const User = require('../models/User');
const Place = require('../models/Place');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Validation Schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    businessName: z.string().min(1, 'Business name is required'),
    placeName: z.string().min(1, 'Place name is required'),
    placeType: z.enum(['Clinic', 'Hospital', 'Restaurant', 'Government Office', 'Service Center', 'Other']),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

// Register Business
exports.register = catchAsync(async (req, res, next) => {
    console.log('=== REGISTER REQUEST ===');
    console.log('Body:', req.body);
    
    // 1. Validate Input
    console.log('Validating input...');
    const validatedData = registerSchema.parse(req.body);
    const { email, password, businessName, placeName, placeType, address, city } = validatedData;
    console.log('Validation passed');

    // 2. Check if user exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log('User already exists');
        return next(new AppError('Email already registered', 400));
    }

    // 3. Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    console.log('Creating user...');
    const user = new User({
        email,
        password: hashedPassword,
        businessName,
        role: 'business'
    });
    await user.save();
    console.log('User created:', user._id);

    // 5. Create place for this business
    console.log('Creating place...');
    const place = new Place({
        name: placeName,
        type: placeType,
        address,
        city,
        ownerId: user._id,
        currentWaitTime: 0,
        crowdLevel: 'Low',
        confidenceLevel: 'Low'
    });
    await place.save();
    console.log('Place created:', place._id);

    // 6. Generate token
    console.log('Generating token...');
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Registration successful');
    res.status(201).json({
        status: 'success',
        token,
        user: { id: user._id, email: user.email, businessName: user.businessName },
        place: { id: place._id, name: place.name }
    });
});

// Login Business
exports.login = catchAsync(async (req, res, next) => {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    
    try {
        // 1. Validate Input
        console.log('Validating input...');
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        console.log('Validation passed for:', email);

        // 2. Find user & check password
        console.log('Finding user...');
        const user = await User.findOne({ email });
        console.log('User found:', !!user);
        
        if (!user) {
            console.log('User not found');
            return next(new AppError('Invalid email or password', 401));
        }

        console.log('Comparing passwords...');
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);
        
        if (!passwordMatch) {
            return next(new AppError('Invalid email or password', 401));
        }

        // 3. Find their place
        console.log('Finding place...');
        const place = await Place.findOne({ ownerId: user._id });
        console.log('Place found:', !!place);

        // 4. Generate token
        console.log('Generating token...');
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        console.log('Login successful');
        res.json({
            status: 'success',
            token,
            user: { id: user._id, email: user.email, businessName: user.businessName },
            place: place ? { id: place._id, name: place.name } : null
        });
    } catch (error) {
        console.error('Login error:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
});

// Get current user info
exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return next(new AppError('User not found', 404));

    const place = await Place.findOne({ ownerId: req.userId });
    res.json({
        status: 'success',
        user,
        place
    });
});
