// Quick MongoDB connection test
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://dasdivyadarshan_db_user:BcKktOKcX3o53Rzw@cluster0.a99djwz.mongodb.net/waitclarity?retryWrites=true&w=majority';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGO_URI.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected successfully!');
        
        // Try to count documents
        const Place = mongoose.model('Place', new mongoose.Schema({}, { strict: false }));
        const count = await Place.countDocuments();
        console.log(`📊 Found ${count} places in database`);
        
        if (count === 0) {
            console.log('⚠️  Database is empty - you need to seed data!');
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed!');
        console.error('Error:', err.message);
        process.exit(1);
    });
