import { Request, Response } from 'express';
import { ResponseHelper, ErrorCode } from '../utils/response';
import { 
  DiodeRepository, 
  LightIntensityRepository, 
  TemperatureRepository, 
  WaterLevelRepository,
  HumidityRepository,
  BaseRepository 
} from '../repositories/repository';


export class DatabaseController {
  
  // Repository instances
  private static repositories = {
    diodes: new DiodeRepository(),
    lightIntensity: new LightIntensityRepository(),
    temperatures: new TemperatureRepository(),
    waterLevels: new WaterLevelRepository(),
    humidities: new HumidityRepository()
  };

  /**
   * Generic function to get all records from any repository
   */
  private static async getAllRecords(
    repo: BaseRepository<any>, 
    resourceName: string, 
    req: Request, 
    res: Response
  ) {
    try {
      const limit = parseInt(req.query.limit as string) || undefined;
      const skip = parseInt(req.query.skip as string) || undefined;
      
      const records = await repo.find({}, limit, skip);
      const total = await repo.count();

      return ResponseHelper.success(res, {
        data: records,
        pagination: {
          total,
          count: records.length,
          limit: limit || total,
          skip: skip || 0
        }
      }, `${resourceName} retrieved successfully`);

    } catch (error) {
      return ResponseHelper.databaseError(res, error, `Failed to retrieve ${resourceName.toLowerCase()}`);
    }
  }

  /**
   * Generic function to create a new record
   */
  private static async createRecord(
    repo: BaseRepository<any>,
    resourceName: string,
    req: Request,
    res: Response
  ) {
    try {
      const data = req.body;

      // Add date if not provided
      if (!data.date) {
        data.date = new Date();
      }

      const record = await repo.create(data);

      return ResponseHelper.success(res, {
        data: record
      }, `${resourceName} created successfully`, 201);

    } catch (error) {
      return ResponseHelper.databaseError(res, error, `Failed to create ${resourceName.toLowerCase()}`);
    }
  }

  /**
   * Generic function to get records by date range from any repository
   */
  private static async getRecordsByDateRange(
    repo: BaseRepository<any>, 
    resourceName: string, 
    req: Request, 
    res: Response
  ) {
    try {
      const { startDate, endDate } = req.query;
      const limit = parseInt(req.query.limit as string) || undefined;
      const skip = parseInt(req.query.skip as string) || undefined;

      if (!startDate || !endDate) {
        return ResponseHelper.validationError(res, [
          { field: 'startDate', message: 'Start date is required (YYYY-MM-DD)' },
          { field: 'endDate', message: 'End date is required (YYYY-MM-DD)' }
        ]);
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return ResponseHelper.validationError(res, [
          { field: 'date', message: 'Invalid date format. Use YYYY-MM-DD' }
        ]);
      }

      end.setHours(23, 59, 59, 999);

      const filter = {
        date: {
          $gte: start,
          $lte: end
        }
      };

      const records = await repo.find(filter, limit, skip);
      const total = await repo.count(filter);

      return ResponseHelper.success(res, {
        data: records,
        dateRange: {
          startDate: start.toISOString(),
          endDate: end.toISOString()
        },
        pagination: {
          total,
          count: records.length,
          limit: limit || total,
          skip: skip || 0
        }
      }, `Found ${records.length} ${resourceName.toLowerCase()} in date range`);

    } catch (error) {
      return ResponseHelper.databaseError(res, error, `Failed to retrieve ${resourceName.toLowerCase()} by date range`);
    }
  }

  // Diodes endpoints
  static getAllDiodes = (req: Request, res: Response) => 
    DatabaseController.getAllRecords(DatabaseController.repositories.diodes, 'Diodes', req, res);

  static getDiodesByDateRange = (req: Request, res: Response) => 
    DatabaseController.getRecordsByDateRange(DatabaseController.repositories.diodes, 'Diodes', req, res);

  static createDiode = (req: Request, res: Response) => 
    DatabaseController.createRecord(DatabaseController.repositories.diodes, 'Diode', req, res);

  // Light intensity endpoints
  static getAllLightIntensity = (req: Request, res: Response) => 
    DatabaseController.getAllRecords(DatabaseController.repositories.lightIntensity, 'Light intensity records', req, res);

  static getLightIntensityByDateRange = (req: Request, res: Response) => 
    DatabaseController.getRecordsByDateRange(DatabaseController.repositories.lightIntensity, 'Light intensity records', req, res);

  static createLightIntensity = (req: Request, res: Response) => 
    DatabaseController.createRecord(DatabaseController.repositories.lightIntensity, 'Light intensity record', req, res);

  // Temperature endpoints
  static getAllTemperatures = (req: Request, res: Response) => 
    DatabaseController.getAllRecords(DatabaseController.repositories.temperatures, 'Temperature records', req, res);

  static getTemperaturesByDateRange = (req: Request, res: Response) => 
    DatabaseController.getRecordsByDateRange(DatabaseController.repositories.temperatures, 'Temperature records', req, res);

  static createTemperature = (req: Request, res: Response) => 
    DatabaseController.createRecord(DatabaseController.repositories.temperatures, 'Temperature record', req, res);

  // Water level endpoints
  static getAllWaterLevels = (req: Request, res: Response) => 
    DatabaseController.getAllRecords(DatabaseController.repositories.waterLevels, 'Water level records', req, res);

  static getWaterLevelsByDateRange = (req: Request, res: Response) => 
    DatabaseController.getRecordsByDateRange(DatabaseController.repositories.waterLevels, 'Water level records', req, res);

  static createWaterLevel = (req: Request, res: Response) => 
    DatabaseController.createRecord(DatabaseController.repositories.waterLevels, 'Water level record', req, res);

  // Humidity endpoints
  static getAllHumidities = (req: Request, res: Response) => 
    DatabaseController.getAllRecords(DatabaseController.repositories.humidities, 'Humidity records', req, res);

  static getHumiditiesByDateRange = (req: Request, res: Response) => 
    DatabaseController.getRecordsByDateRange(DatabaseController.repositories.humidities, 'Humidity records', req, res);

  static createHumidity = (req: Request, res: Response) => 
    DatabaseController.createRecord(DatabaseController.repositories.humidities, 'Humidity record', req, res);

  static healthCheck = async (req: Request, res: Response) => {
    try {
      await DatabaseController.repositories.diodes.count();
      return ResponseHelper.success(res, {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      }, 'Database health check passed');
    } catch (error) {
      return ResponseHelper.databaseError(res, error, 'Database health check failed');
    }
  };
}

export default DatabaseController;