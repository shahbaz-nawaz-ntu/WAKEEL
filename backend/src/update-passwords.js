// backend/src/update-passwords.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import connectDB from './config/database.js';

dotenv.config();

const usersToUpdate = [
  {
    email: 'hr.callbackcrew@gmail.com',
    password: 'callback2026project',
    name: 'HR Callback Crew',
    role: 'admin',
    phone: '+92(555) 123-4567',
    company: 'Callback Crew',
  },
  {
    email: 'admin@jurisflow.com',
    password: 'wakeel2026jurisflow',
    name: 'Admin',
    role: 'admin',
    phone: '+92(555) 000-0000',
    company: 'JurisFlow',
  },
];

const updatePasswords = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected\n');

    for (const userData of usersToUpdate) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        // Generate new password hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        // Update user
        existingUser.password = hashedPassword;
        existingUser.name = userData.name || existingUser.name;
        existingUser.role = userData.role || existingUser.role;
        existingUser.phone = userData.phone || existingUser.phone;
        existingUser.company = userData.company || existingUser.company;
        existingUser.isActive = true;
        
        await existingUser.save();
        console.log(`✅ Updated: ${userData.email}`);
        console.log(`   New Password: ${userData.password}`);
        console.log(`   Role: ${existingUser.role}`);
        console.log('---');
      } else {
        // Create new user if doesn't exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        const newUser = new User({
          ...userData,
          password: hashedPassword,
          isActive: true,
        });
        
        await newUser.save();
        console.log(`✅ Created: ${userData.email}`);
        console.log(`   Password: ${userData.password}`);
        console.log('---');
      }
    }

    console.log('\n🎉 Passwords updated successfully!');
    console.log('\n📋 Updated Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    usersToUpdate.forEach(u => {
      console.log(`📧 ${u.email}`);
      console.log(`🔑 Password: ${u.password}`);
      console.log(`👤 Role: ${u.role || 'user'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updatePasswords();