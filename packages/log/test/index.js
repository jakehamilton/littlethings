const log = require('../src');

try {
    log.setVerbosity('TRACE');
    log.info('This is an info log.');
    log.debug('This is a debug log.');
    log.trace('This is a trace log.');

    const custom = log.create('my-app');
    custom.info('This is a custom info log.');
    custom.debug('This is a custom debug log.');
    custom.trace('This is a custom trace log.');
} catch (error) {
    console.error('An unexpected error occurred.');
    console.log(error);
    process.exit(1);
}
