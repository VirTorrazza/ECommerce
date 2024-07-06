import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../logger/logger.js";

class MongoClient {
  constructor() {
    this.connected = false; // Initialize connected status to false
    this.client = mongoose;
  }

  connect = async () => {
    try {
      await this.client.connect(config.mongo.uri, {
        dbName: config.mongo.dbName,
      });
      this.connected = true;
   
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error(`Error connecting to MongoDB:${error}`);
      throw new Error("Cannot connect to database");
    }
  };

  disconnect = async () => {
    try {
      await this.client.disconnect();
      this.connected = false; // Disconnected 
      logger.info("Disconnected from MongoDB");
    } catch (error) {
      logger.error(`Error disconnecting from MongoDB:${error}`);
      throw new Error("Cannot disconnect from database");
    }
  };
}

export default MongoClient;
