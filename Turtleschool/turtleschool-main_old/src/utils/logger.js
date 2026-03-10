import pino from 'pino'

// create pino logger
const logger = pino({
 transport: {
   target: 'pino-pretty'
 },
});

export default logger