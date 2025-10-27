import { Response } from 'express';


export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export enum ErrorCode {
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_INPUT = 'INVALID_INPUT',

  DATABASE_ERROR = 'DATABASE_ERROR',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',

  FIREBASE_NOT_CONFIGURED = 'FIREBASE_NOT_CONFIGURED',
  FIREBASE_AUTH_ERROR = 'FIREBASE_AUTH_ERROR',
  FIREBASE_ADMIN_ERROR = 'FIREBASE_ADMIN_ERROR',

  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',

  JWT_SECRET_MISSING = 'JWT_SECRET_MISSING',
  JWT_VERIFICATION_FAILED = 'JWT_VERIFICATION_FAILED'
}


export class ResponseHelper {

  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: HttpStatus = HttpStatus.OK
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    errorCode: ErrorCode,
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        details
      },
      timestamp: new Date().toISOString()
    };

    console.error(`API Error [${errorCode}]:`, {
      message,
      path: res.req?.originalUrl,
      method: res.req?.method,
      timestamp: response.timestamp,
      details: details && typeof details === 'object' ? JSON.stringify(details) : details
    });

    return res.status(statusCode).json(response);
  }

  static authError(res: Response, errorCode: ErrorCode, message?: string): Response {
    const defaultMessages: Record<string, string> = {
      [ErrorCode.NO_TOKEN]: 'No authentication token provided',
      [ErrorCode.INVALID_TOKEN]: 'Invalid authentication token',
      [ErrorCode.TOKEN_EXPIRED]: 'Authentication token has expired',
      [ErrorCode.TOKEN_REVOKED]: 'Authentication token has been revoked',
      [ErrorCode.UNAUTHORIZED]: 'Authentication required',
      [ErrorCode.FORBIDDEN]: 'Access forbidden',
      [ErrorCode.JWT_SECRET_MISSING]: 'JWT secret not configured',
      [ErrorCode.JWT_VERIFICATION_FAILED]: 'JWT token verification failed'
    };

    const statusCodes: Record<string, HttpStatus> = {
      [ErrorCode.NO_TOKEN]: HttpStatus.UNAUTHORIZED,
      [ErrorCode.INVALID_TOKEN]: HttpStatus.FORBIDDEN,
      [ErrorCode.TOKEN_EXPIRED]: HttpStatus.FORBIDDEN,
      [ErrorCode.TOKEN_REVOKED]: HttpStatus.FORBIDDEN,
      [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
      [ErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
      [ErrorCode.JWT_SECRET_MISSING]: HttpStatus.INTERNAL_SERVER_ERROR,
      [ErrorCode.JWT_VERIFICATION_FAILED]: HttpStatus.FORBIDDEN
    };

    return this.error(
      res,
      errorCode,
      message || defaultMessages[errorCode] || 'Authentication error',
      statusCodes[errorCode] || HttpStatus.FORBIDDEN
    );
  }

  static firebaseError(res: Response, error: any): Response {
    const firebaseErrorMap: Record<string, { code: ErrorCode; status: HttpStatus; message: string }> = {
      'auth/id-token-expired': {
        code: ErrorCode.TOKEN_EXPIRED,
        status: HttpStatus.FORBIDDEN,
        message: 'Firebase token has expired'
      },
      'auth/id-token-revoked': {
        code: ErrorCode.TOKEN_REVOKED,
        status: HttpStatus.FORBIDDEN,
        message: 'Firebase token has been revoked'
      },
      'auth/invalid-id-token': {
        code: ErrorCode.INVALID_TOKEN,
        status: HttpStatus.FORBIDDEN,
        message: 'Invalid Firebase token'
      },
      'auth/user-not-found': {
        code: ErrorCode.RECORD_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        message: 'User not found'
      }
    };

    const firebaseError = firebaseErrorMap[error.code];
    if (firebaseError) {
      return this.error(res, firebaseError.code, firebaseError.message, firebaseError.status, {
        firebaseCode: error.code
      });
    }

    return this.error(
      res,
      ErrorCode.FIREBASE_AUTH_ERROR,
      'Firebase authentication error',
      HttpStatus.INTERNAL_SERVER_ERROR,
      { firebaseCode: error.code, firebaseMessage: error.message }
    );
  }

  static validationError(res: Response, errors: any[], message?: string): Response {
    return this.error(
      res,
      ErrorCode.VALIDATION_ERROR,
      message || 'Validation failed',
      HttpStatus.BAD_REQUEST,
      { validationErrors: errors }
    );
  }

  static databaseError(res: Response, error: any, message?: string): Response {
    return this.error(
      res,
      ErrorCode.DATABASE_ERROR,
      message || 'Database operation failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? { dbError: error.message } : undefined
    );
  }

  static notFound(res: Response, resource?: string): Response {
    return this.error(
      res,
      ErrorCode.RECORD_NOT_FOUND,
      resource ? `${resource} not found` : 'Resource not found',
      HttpStatus.NOT_FOUND
    );
  }
}

export const internalServerError = (error: Error, req: any, res: Response, next: any) => {
  console.error('Unhandled error:', error);

  if (res.headersSent) {
    return next(error);
  }

  ResponseHelper.error(
    res,
    ErrorCode.INTERNAL_ERROR,
    'An unexpected error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR,
    process.env.NODE_ENV === 'development' ? { stack: error.stack } : undefined
  );
};

export default ResponseHelper;