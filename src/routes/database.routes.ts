import { Router } from 'express';
import DatabaseController from '../controllers/database.controller';
import { verifyLocalJwtToken } from '../middleware/auth';

const router = Router();

// Database health and stats
router.get('/health', verifyLocalJwtToken, DatabaseController.healthCheck);

// Diodes endpoints
router.get('/diodes', DatabaseController.getAllDiodes);
router.get('/diodes/date-range', DatabaseController.getDiodesByDateRange);

// Light intensity endpoints
router.get('/light-intensity', DatabaseController.getAllLightIntensity);
router.get('/light-intensity/date-range', DatabaseController.getLightIntensityByDateRange);

// Temperature endpoints
router.get('/temperatures', DatabaseController.getAllTemperatures);
router.get('/temperatures/date-range', DatabaseController.getTemperaturesByDateRange);

// Water level endpoints
router.get('/water-levels', DatabaseController.getAllWaterLevels);
router.get('/water-levels/date-range', DatabaseController.getWaterLevelsByDateRange);

// Humidity endpoints
router.get('/humidities', DatabaseController.getAllHumidities);
router.get('/humidities/date-range', DatabaseController.getHumiditiesByDateRange);

export default router;