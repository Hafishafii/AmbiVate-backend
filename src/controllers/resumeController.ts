import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
  
    res.status(200).json({
      message: 'Resume uploaded successfully',
      file: req.file.filename,
    });
};


export const deleteResume = async (req: Request, res: Response): Promise<void> => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', '..', 'uploads', 'resumes', filename);
  
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'Resume deleted successfully' });
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting file', error });
    }
  };