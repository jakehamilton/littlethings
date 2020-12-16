const log = require("../src");

try {
    log.setVerbosity(
        process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toUpperCase() : "TRACE"
    );
    log.info({
        name: "littlelog",
        likes: ["logging", "javascript"],
        pets: [
            {
                name: "scruffles",
                getsTreats: true,
                traits: ["gray", "small", "curly"],
            },
        ],
        null: null,
        undefined: undefined,
    });
    log.info("This is an info log.");
    log.warn("This is an warn log.");
    log.debug("This is a debug log.");
    log.trace("This is a trace log.");
    log.error("This is an error log.");

    const custom = log.create("my-app");
    custom.info("This is a custom info log.");
    custom.warn("This is a custom warn log.");
    custom.debug("This is a custom debug log.");
    custom.trace("This is a custom trace log.");
    custom.error("This is an error log.");
} catch (error) {
    console.error("An unexpected error occurred.");
    console.log(error);
    process.exit(1);
}
