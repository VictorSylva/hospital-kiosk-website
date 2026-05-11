import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/authUtils.js';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// AUTH DISABLED FOR TESTING
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Bypass authentication - set mock user for testing
  req.user = { id: 'test-user', role: 'admin', email: 'test@example.com' };
  next();
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Bypass role authorization - allow all roles for testing
    next();
  };
};

export default { authenticate, authorize };
