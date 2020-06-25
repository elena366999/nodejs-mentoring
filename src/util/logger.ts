import winston, { createLogger, format, Logger } from 'winston';

const formatter = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});
export const logger: Logger = createLogger({
    exitOnError: false,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        formatter
    ),
    transports: [
        new winston.transports.Console(
            {
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    formatter)
            }),
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log', level: 'info' })
    ]
})
;
