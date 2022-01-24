import { describe, it, expect } from "vitest";

import Coder from "..";

describe("Coder", () => {
	describe("initialization", () => {
		it("should initialize", () => {
			expect(() => {
				new Coder();
			}).not.toThrow();
		});

		it("should default indentation", () => {
			const coder = new Coder();

			coder.openBlock("const x =");
			coder.line("exists: true,");
			coder.closeBlock(";");

			expect(coder.code).toMatchInlineSnapshot(`
				"const x = {
					exists: true,
				};
				"
			`);
		});

		it("should customize indentation", () => {
			const coder = new Coder({
				indentAmount: 2,
				indentChar: " ",
			});

			coder.openBlock("const x =");
			coder.line("exists: true,");
			coder.closeBlock(";");

			expect(coder.code).toMatchInlineSnapshot(`
				"const x = {
				  exists: true,
				};
				"
			`);
		});
	});

	it("should write lines", () => {
		const coder = new Coder();

		coder.line("const a = 1;");
		coder.line("const b = 2;");
		coder.line("const c = 3;");

		expect(coder.code).toMatchInlineSnapshot(`
			"const a = 1;
			const b = 2;
			const c = 3;
			"
		`);
	});

	it("should indent manually", () => {
		const coder = new Coder();

		coder.line("const a = {");
		coder.indent();
		coder.line("value: true,");
		coder.dedent();
		coder.line("};");

		expect(coder.code).toMatchInlineSnapshot(`
			"const a = {
				value: true,
			};
			"
		`);
	});

	it("should indent blocks", () => {
		const coder = new Coder();

		coder.openBlock("function f ()");
		coder.line("return true;");
		coder.closeBlock();

		expect(coder.code).toMatchInlineSnapshot(`
			"function f () {
				return true;
			}
			"
		`);
	});

	it("should indent with spaces", () => {
		const coder = new Coder({
			indentChar: " ",
			indentAmount: 2,
		});

		coder.openBlock("function f ()");
		coder.line("return true;");
		coder.closeBlock();

		expect(coder.code).toMatchInlineSnapshot(`
			"function f () {
			  return true;
			}
			"
		`);
	});

	it("should indent multiple times", () => {
		const coder = new Coder();

		coder.openBlock("const x =");
		coder.openBlock("method()");
		coder.line("return true;");
		coder.closeBlock(",");
		coder.closeBlock();

		expect(coder.code).toMatchInlineSnapshot(`
			"const x = {
				method() {
					return true;
				},
			}
			"
		`);
	});

	it("should indent multiple times with spaces", () => {
		const coder = new Coder({
			indentChar: " ",
			indentAmount: 2,
		});

		coder.openBlock("const x =");
		coder.openBlock("method()");
		coder.line("return true;");
		coder.closeBlock(",");
		coder.closeBlock();

		expect(coder.code).toMatchInlineSnapshot(`
			"const x = {
			  method() {
			    return true;
			  },
			}
			"
		`);
	});
});
