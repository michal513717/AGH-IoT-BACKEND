import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult, ValidationChain } from 'express-validator';
import { ResponseHelper } from '../utils/response';

/**
 * Middleware to handle validation results
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.type === 'field' ? (error as any).path : 'unknown',
      message: error.msg
    }));
    
    return ResponseHelper.validationError(res, formattedErrors);
  }
  
  next();
};

/**
 * Validation rules for Diode creation
 */
export const validateDiode = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isBoolean().withMessage('Status must be a boolean (true/false)'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format (e.g., 2025-11-07T10:30:00Z)'),
  handleValidationErrors
];

/**
 * Validation rules for Light Intensity creation
 */
export const validateLightIntensity = [
  body('value')
    .notEmpty().withMessage('Value is required')
    .isNumeric().withMessage('Value must be a number')
    .isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format'),
  handleValidationErrors
];

/**
 * Validation rules for Temperature creation
 */
export const validateTemperature = [
  body('value')
    .notEmpty().withMessage('Value is required')
    .isNumeric().withMessage('Value must be a number')
    .isFloat({ min: -273.15 }).withMessage('Value must be above absolute zero (-273.15°C)'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format'),
  handleValidationErrors
];

/**
 * Validation rules for Water Level creation
 */
export const validateWaterLevel = [
  body('value')
    .notEmpty().withMessage('Value is required')
    .isNumeric().withMessage('Value must be a number')
    .isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format'),
  handleValidationErrors
];

/**
 * Validation rules for Humidity creation
 */
export const validateHumidity = [
  body('value')
    .notEmpty().withMessage('Value is required')
    .isNumeric().withMessage('Value must be a number')
    .isFloat({ min: 0, max: 100 }).withMessage('Value must be between 0 and 100'),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be in ISO 8601 format'),
  handleValidationErrors
];

/**
 * Validation rules for date range queries
 */
export const validateDateRange = [
  query('startDate')
    .notEmpty().withMessage('Start date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Start date must be in YYYY-MM-DD format'),
  query('endDate')
    .notEmpty().withMessage('End date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('End date must be in YYYY-MM-DD format')
    .custom((endDate, { req }) => {
      const startDate = req.query?.startDate as string;
      if (startDate && new Date(endDate) < new Date(startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('skip')
    .optional()
    .isInt({ min: 0 }).withMessage('Skip must be a positive number'),
  handleValidationErrors
];