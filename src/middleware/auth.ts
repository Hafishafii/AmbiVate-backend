import { Request, Response, NextFunction, RequestHandler } from 'express';

export interface AuthRequest extends Request {
  user?: string;
}


export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token !== 'sample123token') {
    res.status(403).json({ message: 'Forbidden: Invalid token' });
    return;
  }


  (req as AuthRequest).user = 'dummyUserId';
  next();
};
