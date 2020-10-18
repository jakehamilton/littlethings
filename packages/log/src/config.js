// @ts-check

/**
 * Map from log level names to their number.
 * @type {{ SILENT: 0, INFO: 1, DEBUG: 2, TRACE: 3 }} LEVEL_TO_NUMBER
 */
const LEVEL_TO_NUMBER = {
    SILENT: 0,
    INFO: 1,
    DEBUG: 2,
    TRACE: 3,
};

/**
 * Map from number to their respective log level names.
 * @type {{ 0: 'SILENT', 1: 'INFO', 2: 'DEBUG', 3: 'TRACE' }} NUMBER_TO_LEVEL
 */
const NUMBER_TO_LEVEL = {
    0: 'SILENT',
    1: 'INFO',
    2: 'DEBUG',
    3: 'TRACE',
};

module.exports = {
    LEVEL_TO_NUMBER,
    NUMBER_TO_LEVEL,
};
