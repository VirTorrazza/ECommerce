import dotenv from 'dotenv';
dotenv.config();

const config = {
    apiserver: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME
    }
};

export default config;
