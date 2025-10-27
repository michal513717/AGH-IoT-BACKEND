import { model, Model, Schema } from "mongoose";
import { Document, Types,  } from 'mongoose';
import mongoose from "mongoose";

export type MongoCollectionRecord<T> = Document & {
    _id: Types.ObjectId;
    value: T;
    date: Date;
};

export type DiodeStatusRecord = Document & {
    _id: Types.ObjectId;
    status: boolean;
    date: Date;
};

export type LightIntensityRecord = MongoCollectionRecord<number>;
export type TemperatureRecord = MongoCollectionRecord<number>;
export type WaterLevelRecord = MongoCollectionRecord<number>;
export type HumidityRecord = MongoCollectionRecord<number>;

export const DiodeStatusSchema = new Schema<DiodeStatusRecord>({
    status: { type: Boolean, required: true },
    date: { type: Date, required: true }
}, {
    versionKey: false
});

export const LightIntensitySchema = new Schema<MongoCollectionRecord<number>>({
    value: { type: Number, required: true },
    date: { type: Date, required: true }
}, {
    versionKey: false
});

export const TemperatureSchema = new Schema<MongoCollectionRecord<number>>({
    value: { type: Number, required: true },
    date: { type: Date, required: true }
}, {
    versionKey: false
});

export const WaterLevelSchema = new Schema<MongoCollectionRecord<number>>({
    value: { type: Number, required: true },
    date: { type: Date, required: true }
}, {
    versionKey: false
});

export const HumiditySchema = new Schema<MongoCollectionRecord<number>>({
    value: { type: Number, required: true },
    date: { type: Date, required: true }
}, {
    versionKey: false
});