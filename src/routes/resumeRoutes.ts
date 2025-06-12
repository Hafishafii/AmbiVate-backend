import express from 'express';
import { uploadResume, deleteResume } from '../controllers/resumeController';
import { authenticate } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      const dir = 'uploads/resumes';
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
  
    filename: function (_req, file, cb) {
      const sanitizedName = file.originalname.replace(/\s+/g, '-');
      cb(null, `resume-${Date.now()}-${sanitizedName}`);
    },
});

const upload = multer({ storage });


router.post('/upload', authenticate, upload.single('resume'), uploadResume);


router.delete('/delete/:filename', authenticate, deleteResume);

export default router;
