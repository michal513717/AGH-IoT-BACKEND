import * as dotenv from 'dotenv';
import express from 'express';
import { configureNotValidRoute, debugRequest } from './utils/requests';
import { APPLICATION_CONFIG } from './utils/config';
import { getFirebaseClient } from './providers/firebase';
import { mainController } from './controllers/main';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

async function main() {
    app.use(express.json());

    try {
        const firebaseClient = await getFirebaseClient()

        if(APPLICATION_CONFIG.DEBUG_REQUEST === true){ 
            debugRequest(app);
        }

        app.get('/', mainController);
        
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