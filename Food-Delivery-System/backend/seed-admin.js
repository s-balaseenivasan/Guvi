require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  username: 'admin',
  email: 'admin@foodiehub.com',
  password: 'Admin@123',
  role: 'admin',
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ $or: [{ email: ADMIN.email }, { username: ADMIN.username }] });
  if (existing) {
    console.log(`⚠️  Admin already exists — email: ${existing.email} | role: ${existing.role}`);
    await mongoose.disconnect();
    return;
  }

  await User.create(ADMIN);
  console.log('✅ Admin user created!');
  console.log(`   Username : ${ADMIN.username}`);
  console.log(`   Email    : ${ADMIN.email}`);
  console.log(`   Password : ${ADMIN.password}`);
  console.log('   ⚡ Change the password after first login!');

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
