import mongoose, { Model, ClientSession, Document, FilterQuery } from "mongoose";
import { DiodeStatusRecord, DiodeStatusSchema, HumidityRecord, HumiditySchema, LightIntensityRecord, LightIntensitySchema, TemperatureRecord, TemperatureSchema, WaterLevelRecord, WaterLevelSchema } from "../models/mongo.schema";

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    if (session) {
      const createdDoc = new this.model(data);
      return await createdDoc.save({ session });
    }

    const createdDoc = new this.model(data);
    return await createdDoc.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: FilterQuery<T> = {}, limit?: number, skip?: number): Promise<T[]> {
    const query = this.model.find(filter);

    if (skip) query.skip(skip);
    if (limit) query.limit(limit);

    return query.exec();
  }

  async update(id: string, data: any, session?: ClientSession): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, session }).exec() as Promise<T | null>;
  }

  async updateOne(filter: FilterQuery<T>, data: any, session?: ClientSession): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true, session }).exec() as Promise<T | null>;
  }

  async delete(id: string, session?: ClientSession): Promise<T | null> {
    return this.model.findByIdAndDelete(id, { session }).exec();
  }

  async deleteOne(filter: FilterQuery<T>, session?: ClientSession): Promise<T | null> {
    return this.model.findOneAndDelete(filter, { session }).exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const doc = await this.model.findOne(filter).select('_id').exec();
    return !!doc;
  }
}

export class DiodeRepository extends BaseRepository<DiodeStatusRecord> {
  constructor() {
    const diodeModel = mongoose.model<DiodeStatusRecord>("Diode", DiodeStatusSchema, 'diode_status_collection');
    super(diodeModel);
  }
};

export class LightIntensityRepository extends BaseRepository<LightIntensityRecord> {
  constructor() {
    const lightIntensityModel = mongoose.model<LightIntensityRecord>("LightIntensity", LightIntensitySchema, 'light_intensity_collection');
    super(lightIntensityModel);
  }
}

export class TemperatureRepository extends BaseRepository<TemperatureRecord> {
  constructor() {
    const temperatureModel = mongoose.model<TemperatureRecord>("Temperature", TemperatureSchema, 'temperature_collection');
    super(temperatureModel);
  }
}
export class WaterLevelRepository extends BaseRepository<WaterLevelRecord> {  
  constructor() {
    const waterLevelModel = mongoose.model<WaterLevelRecord>("WaterLevel", WaterLevelSchema, 'water_level_collection');
    super(waterLevelModel);
  }
}

export class HumidityRepository extends BaseRepository<HumidityRecord> {  
  constructor() {
    const humidityModel = mongoose.model<HumidityRecord>("Humidity", HumiditySchema, 'humidity_collection');
    super(humidityModel);
  }
}