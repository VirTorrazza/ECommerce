import logger from "../logger/logger.js"

export function printLoggerTests(req, res) {
    logger.debug('Debug Logger test')
    logger.http('Http Logger test')
    logger.info('Info Logger test')
    logger.warning('Warning Logger test')
    logger.error('Error Logger test')
    logger.fatal('Fatal Logger Test')
    res.send({ status: 'success', payload: 'Tests OK' })
}