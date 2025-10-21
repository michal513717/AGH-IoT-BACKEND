import mongoose from 'mongoose';

export const getMongoClient = async (uri: string): Promise<typeof mongoose> => {
    try {
        const client = await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });       
        console.info("MongoDB connected");

        return client;
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error);
        process.exit(1);
    }
}