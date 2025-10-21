import mongoose from 'mongoose';

export const getMongoClient = async (): Promise<typeof mongoose> => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        
        const client = await mongoose.connect(mongoUri, { 
            dbName: process.env.MONGODB_DB_NAME || 'defaultdb' 
        });

        console.info("MongoDB connected");

        return client;
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
}