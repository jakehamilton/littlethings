import { describe, it, expect } from "vitest";

import Schemer, { normalize } from "..";
import { Type } from "../util/type";

describe("Schemer", () => {
	it("should instantiate", () => {
		expect(() => {
			const schemer = new Schemer();
		}).not.toThrow();
	});

	it("should use custom serializers", () => {
		const schemer = new Schemer({
			serializers: {
				name: (identifier) => `Namespace${identifier}`,
				enum: (identifier) => "<ENUM>",
				union: (identifier) => "<UNION>",
				array: (type) => (identifier) => "<ARRAY>",
				date: (identifier) => "<DATE>",
				map: (type) => (identifier) => "<MAP>",
				struct: (name) => (identifier) => "<STRUCT>",
			},
		});

		schemer.emit("Test", {
			type: "object",
			properties: {
				enum: {
					type: "string",
					enum: ["x", "y", "z"],
				},
				union: {
					oneOf: [
						{
							type: "string",
						},
						{
							type: "boolean",
						},
						{
							type: "number",
						},
					],
				},
				map: {
					type: "object",
					additionalProperties: {},
				},
				date: {
					type: "string",
					format: "date-time",
				},
				array: {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
		});

		expect(schemer.render()).toMatchInlineSnapshot(`
			"export interface Test {
				readonly enum?: NamespaceTestEnum;
				readonly union?: NamespaceTestUnion;
				readonly map?: { [key: string]: any };
				readonly date?: Date;
				readonly array?: Array<string>;
			}

			export const serializeTest = (options: Test | undefined) => {
				if (options === undefined) return undefined;
				const result = {
					\\"enum\\": <ENUM>,
					\\"union\\": <UNION>,
					\\"map\\": <MAP>,
					\\"date\\": <DATE>,
					\\"array\\": <ARRAY>,
				};
				return result;
			};

			export enum NamespaceTestEnum {
				X = \\"x\\",
				Y = \\"y\\",
				Z = \\"z\\",
			}

			export type NamespaceTestUnion = (string | boolean | number) & { __type: \\"NamespaceTestUnion\\" };
			export const isNamespaceTestUnion = (input: any): input is NamespaceTestUnion => {
				return [\\"string\\", \\"boolean\\", \\"number\\"].includes(typeof input);
			};

			"
		`);
	});

	it("should throw when no schema exists", () => {
		expect(() => {
			const schemer = new Schemer();

			schemer.emit("MyType");
		}).toThrow();
	});

	it("should emit aliased types", () => {
		const schemer = new Schemer({
			schemas: {
				"a.b.c": {
					properties: {
						name: {
							type: "string",
						},
					},
				},
			},
		});

		schemer.alias("MyType", "a.b.c");

		schemer.emit("MyType");

		expect(schemer.render()).toMatchInlineSnapshot(`
			"export interface ABC {
				readonly name?: string;
			}

			export const serializeABC = (options: ABC | undefined) => {
				if (options === undefined) return undefined;
				const result = {
					\\"name\\": options.name,
				};
				return result;
			};

			"
		`);
	});

	it("should emit custom types", () => {
		const schemer = new Schemer();

		schemer.emit("MyType", (coder) => {
			coder.line("export interface MyType {}");
		});

		expect(schemer.render()).toMatchInlineSnapshot(`
			"export interface MyType {}

			"
		`);
	});
});
