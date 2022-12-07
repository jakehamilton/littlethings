export function getUsage() {
	return (
		`

littletest - A little JavaScript test runner

Usage: littletest [options] [files]

If [files] is omitted, littletest will search the current working directory
(except for node_modules) recursively for files with names like
'*.spec.js', '*.test.tsx', etc.

Options:
  --setup-file, -r        File to load before all tests run
  --per-test-setup-file   File to load before each test runs
  --concurrency           How many tests to run at once. [default=cpus-1]
  --help, -h              Show this help output
  --verbose, -v           Print additional output

Examples:
  littletest
  littletest -r ./setup.js
  littletest ./src/index.test.js
  littletest -r ./setup.js ./src/index.test.js
  littletest ./src/index.test.js ./src/dog.test.js
  littletest ./src/**/*.test.js # Relies on your shell's glob expansion

  `.trim() + "\n"
	);
}
