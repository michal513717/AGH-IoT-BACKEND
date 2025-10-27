import { ResponseHelper, ErrorCode } from '../utils/response';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthController {
  
  //ONLY FOR TESTING PURPOSES
  static generateTestTokens = async (req: Request, res: Response) => {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return ResponseHelper.authError(res, ErrorCode.JWT_SECRET_MISSING);
      }

      const testUsers = [
        { userId: 'user1', email: 'user@test.com', role: 'user' }
      ];

      const tokens = testUsers.map(user => {
        const payload = {
          ...user,
          iat: Math.floor(Date.now() / 1000),
          provider: 'local'
        };
        
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
        
        return {
          user: payload,
          token,
          type: 'Bearer',
          expiresIn: '24h'
        };
      });

      return ResponseHelper.success(res, { tokens }, 'Test tokens generated successfully');

    } catch (error) {
      return ResponseHelper.error(
        res,
        ErrorCode.JWT_VERIFICATION_FAILED,
        'Failed to generate test tokens'
      );
    }
  };

  static getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      return ResponseHelper.success(res, {
        user: req.user,
        authenticated: true,
        timestamp: new Date().toISOString()
      }, 'User information retrieved successfully');

    } catch (error) {
      return ResponseHelper.error(
        res,
        ErrorCode.INTERNAL_ERROR,
        'Failed to retrieve user information'
      );
    }
  };
}

export default AuthController;