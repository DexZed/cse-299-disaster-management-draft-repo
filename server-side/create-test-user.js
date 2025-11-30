const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/disaster-management';

async function createTestUser() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const userSchema = new mongoose.Schema({
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: { type: String, enum: ['admin', 'user', 'affected', 'volunteer'] },
      profileImage: String,
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema, 'users');

    // Create or find test user
    let user = await User.findOne({ email: 'testvolunteer@example.com' });

    if (!user) {
      user = await User.create({
        name: 'Test Volunteer',
        email: 'testvolunteer@example.com',
        password: 'hashedPassword123',
        role: 'volunteer',
      });
      console.log('✓ Created test user:', user._id.toString());
    } else {
      console.log('✓ Test user already exists:', user._id.toString());
    }

    console.log('\nUse this USER_ID for the test client:');
    console.log(`$env:USER_ID = '${user._id.toString()}'`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createTestUser();
