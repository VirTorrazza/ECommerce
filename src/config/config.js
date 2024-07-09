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
    },
    nodemailer: {
        user: process.env.NODEMAILER_USER,
        password: process.env.NODEMAILER_PASS
    }
};

export default config;
