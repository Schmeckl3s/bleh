const {format, createLogger, transports} = require('winston');
const {combine, timestamp, printf} = format;


const logFormat = printf(({ level, message,  timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({format: "MM-DD-YYYY HH:mm:ss"}),
    logFormat
  ),
 // defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()],
});

module.exports = logger;