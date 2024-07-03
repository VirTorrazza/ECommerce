import winston from 'winston';
import config from '../config/config.js';

const customWinstonLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

const customWinstonColors = {
    debug: 'gray',
    http: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'magenta',
    fatal: 'red'
};

winston.addColors(customWinstonColors); // Add custom levels and colors

const env = config.environment.env;

let logger;

const createLogger = (env) => { // Function to create logger based on environment
    if (env === 'DEV') {
        logger = winston.createLogger({
            levels: customWinstonLevels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                })
            ]
        });
    } else {
        logger = winston.createLogger({
            levels: customWinstonLevels,
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                }),
                new winston.transports.File({
                    filename: 'errors.log',
                    level: 'fatal',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                })
            ]
        });
    }
};

createLogger(env);

export default logger;
