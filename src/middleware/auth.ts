import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import firebaseService from '../providers/firebase';
import { ResponseHelper, ErrorCode } from '../utils/response';

export const verifyLocalJwtToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return ResponseHelper.authError(res, ErrorCode.JWT_SECRET_MISSING);
    }

    jwt.verify(token, jwtSecret);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return ResponseHelper.authError(res, ErrorCode.INVALID_TOKEN, 'Invalid JWT token');
    }

    if (error instanceof jwt.TokenExpiredError) {
      return ResponseHelper.authError(res, ErrorCode.TOKEN_EXPIRED, 'JWT token has expired');
    }

    console.error('JWT verification error:', error);
    return ResponseHelper.authError(res, ErrorCode.JWT_VERIFICATION_FAILED);
  }
};


export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    const auth = await firebaseService.getAuth();
    const decodedToken = await auth.verifyIdToken(token);

    console.info('Firebase token verified:');
    console.info(decodedToken);

    next();
  } catch (error: any) {
    return ResponseHelper.firebaseError(res, error);
  }
};


const extractToken = (authHeader: string | undefined): string => {
  try {
    if (!authHeader) {
      throw new Error('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Error('Token not found in Authorization header');
    }

    return token;
  } catch (err) {
    console.error('Error extracting token:', err);
    throw err;
  }
};