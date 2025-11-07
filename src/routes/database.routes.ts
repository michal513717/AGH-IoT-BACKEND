import { Router } from 'express';
import DatabaseController from '../controllers/database.controller';
import { verifyLocalJwtToken } from '../middleware/auth';
import { 
  validateDiode, 
  validateLightIntensity, 
  validateTemperature, 
  validateWaterLevel, 
  validateHumidity,
  validateDateRange,
} from '../middleware/validation';

const router = Router();

// Database health and stats
router.get('/health', DatabaseController.healthCheck);
router.get('/health-token', verifyLocalJwtToken, DatabaseController.healthCheck);


// Diodes endpoints
router.get('/diodes', DatabaseController.getAllDiodes);
router.get('/diodes/date-range', validateDateRange, DatabaseController.getDiodesByDateRange);
router.post('/diodes', validateDiode, DatabaseController.createDiode);

// Light intensity endpoints
router.get('/light-intensity', DatabaseController.getAllLightIntensity);
router.get('/light-intensity/date-range', validateDateRange, DatabaseController.getLightIntensityByDateRange);
router.post('/light-intensity', validateLightIntensity, DatabaseController.createLightIntensity);

// Temperature endpoints
router.get('/temperatures', DatabaseController.getAllTemperatures);
router.get('/temperatures/date-range', validateDateRange, DatabaseController.getTemperaturesByDateRange);
router.post('/temperatures', validateTemperature, DatabaseController.createTemperature);

// Water level endpoints
router.get('/water-levels', DatabaseController.getAllWaterLevels);
router.get('/water-levels/date-range', validateDateRange, DatabaseController.getWaterLevelsByDateRange);
router.post('/water-levels', validateWaterLevel, DatabaseController.createWaterLevel);

// Humidity endpoints
router.get('/humidities', DatabaseController.getAllHumidities);
router.get('/humidities/date-range', validateDateRange, DatabaseController.getHumiditiesByDateRange);
router.post('/humidities', validateHumidity, DatabaseController.createHumidity);

export default router;