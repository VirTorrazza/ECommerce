import dotenv from 'dotenv';
dotenv.config();

const config = {
    persistence:{
        type: process.env.PERSISTENCE
    },
    apiserver: {
        port: process.env.PORT
    },
    mongo: {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME
    },
    environment:{
        env: process.env.ENVIR
    }
};

export default config;
