const AppError = require('../utils/AppError');
const { ZodError } = require('zod');

const handleZodError = (err) => {
    const errors = err.errors.map(el => `${el.path.join('.')}: ${el.message}`);
    return new AppError(`Validation failed: ${errors.join('. ')}`, 400);
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Always log errors
    console.error('=== ERROR ===');
    console.error('Message:', err.message);
    console.error('Status:', err.statusCode);
    console.error('Stack:', err.stack);
    console.error('=============');

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        let error = Object.assign(err);

        if (error instanceof ZodError) error = handleZodError(error);

        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message
            });
        } else {
            console.error('UNHANDLED ERROR 💥', error);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'production' ? err.message : err.stack
            });
        }
    }
};

module.exports = errorHandler;
