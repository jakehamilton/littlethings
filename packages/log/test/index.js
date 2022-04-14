const {
	default: littlelog,
	configure,
	LogLevel,
} = require("../dist/littlelog.cjs.js");

configure({
	level: LogLevel.Trace,
	icons: true,
});

const scruffles = {
	name: "scruffles",
	getsTreats: true,
	traits: ["gray", "small", "curly"],
};

scruffles.self = scruffles;

const message = {
	name: "LittleLog",
	pets: [scruffles],
	null: null,
	undefined: undefined,
	"the answer": 42,
	"bool?": false,
};

littlelog.info(message);
littlelog.warn(message);
littlelog.debug(message);
littlelog.trace(message);
littlelog.error(message);
littlelog.fatal(message);

const child = littlelog.child("Child");

child.info(message);
child.warn(message);
child.debug(message);
child.trace(message);
child.error(message);
child.fatal(message);

const subchild = child.child("SubChild");

subchild.info(message);
subchild.warn(message);
subchild.debug(message);
subchild.trace(message);
subchild.error(message);
subchild.fatal(message);

littlelog.trace([[[[[[[[[[]]]]]]]]]]);
littlelog.trace({ x: { x: { x: { x: { x: { x: {} } } } } } });
