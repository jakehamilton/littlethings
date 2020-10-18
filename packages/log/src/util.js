// @ts-check
const { LEVEL_TO_NUMBER, NUMBER_TO_LEVEL } = require('./config');

/**
 * @typedef {import('./config')} Config
 */

/**
 * @typedef {keyof Config['LEVEL_TO_NUMBER']} LogLevelName
 */

/**
 * @typedef {keyof Config['NUMBER_TO_LEVEL']} LogLevelNumber
 */

const range = (min, max, x) => {
    return Math.min(Math.max(x, min), max);
};

const microtask = (f) => {
    setTimeout(f, 0);
};

/**
 * Get the log level name for a given number.
 * @param {LogLevelNumber | number} level
 * @returns {LogLevelName}
 */
const getLevelFromNumber = (level = 0) => {
    if (NUMBER_TO_LEVEL.hasOwnProperty(level)) {
        return NUMBER_TO_LEVEL[level];
    } else {
        return NUMBER_TO_LEVEL[0];
    }
};

/**
 * Get the number for a given log level name.
 * @param {LogLevelName} name
 * @returns {LogLevelNumber}
 */
const getNumberFromLevel = (name = 'SILENT') => {
    if (name && LEVEL_TO_NUMBER.hasOwnProperty(name)) {
        return LEVEL_TO_NUMBER[name];
    } else {
        return LEVEL_TO_NUMBER[0];
    }
};

module.exports = {
    range,
    microtask,
    getLevelFromNumber,
    getNumberFromLevel,
};
