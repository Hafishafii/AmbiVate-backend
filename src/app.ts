import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import resumeRoutes from './routes/resumeRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/resume', resumeRoutes);
app.use('/api/auth', authRoutes); 

const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
      console.log(` POST /api/auth/reset-password`);
      console.log(` POST /api/auth/reset-phone`);
      console.log(` POST /api/auth/reset-email`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });


