import { config, createLogger, format, transports } from 'winston';

const logger = createLogger({
    levels: config.syslog.levels,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    defaultMeta: { service: 'data-pixel/broker' },
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

const logFormat = format.printf((info) => {
    const formattedDate = info.timestamp.replace('T', ' ').replace('Z', '');
    return `[${info.level}] - ${formattedDate} | ${info.message}`;
});

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                logFormat,
                format.colorize(),
            ),
        }),
    );
}

export default logger;
