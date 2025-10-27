import * as dotenv from 'dotenv';
import express from 'express';
import { configureNotValidRoute, debugRequest } from './utils/requests';
import { APPLICATION_CONFIG } from './utils/config';
import firebaseService from './providers/firebase';
import { mainController } from './controllers/main';
import { getMongoClient } from './providers/mongo';
import { DiodeRepository, LightIntensityRepository, TemperatureRepository, WaterLevelRepository } from './repositories/repository';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

async function main() {
    app.use(express.json());

    try {
        firebaseService.initialize();
        const mongoClient = await getMongoClient();

        const diodeRepository = new DiodeRepository();
        const lightIntensityRepository = new LightIntensityRepository();
        const temperatureRepository = new TemperatureRepository();
        const waterLevelRepository = new WaterLevelRepository();

        if(APPLICATION_CONFIG.DEBUG_REQUEST === true){ 
            debugRequest(app);
        }

        app.get('/', () => {
            diodeRepository.create({ status: true, date: new Date() });
            lightIntensityRepository.create({ value: 100, date: new Date() });
            temperatureRepository.create({ value: 25, date: new Date() });
            waterLevelRepository.create({ value: 50, date: new Date() });

            console.info('Ping received');
            return 'IoT Backend is running';
        });
        
        configureNotValidRoute(app);

        app.listen(port, () => {
            console.info(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error("error during connection", error);
    }
}

main().catch((error) => {
    console.error(error);
});