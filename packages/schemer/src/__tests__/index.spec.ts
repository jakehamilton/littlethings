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
			"const prelude = {
				id: <T>(x: T) => x,
				isNotUndefined: <T>(x: T | undefined): x is T => x !== undefined,
				serialize: <T, U>(x: T, f: (x: T extends undefined ? never : T) => U): T extends undefined ? undefined : U => {
					// @ts-ignore
					if (x === undefined) return undefined;
					//@ts-ignore
					return f(x);
				},
			};
			
			export type Test = {
				readonly enum?: NamespaceTestEnum;
				readonly union?: NamespaceTestUnion;
				readonly map?: { [key: string]: any };
				readonly date?: Date;
				readonly array?: Array<string>;
			};
			
			export type SerializedTest = {
				\\"enum\\"?: NamespaceTestEnum,
				\\"union\\"?: NamespaceTestUnion,
				\\"map\\"?: { [key: string]: any },
				\\"date\\"?: string,
				\\"array\\"?: Array<string>,
			};
			
			export function serializeTest(options: undefined): undefined;
			export function serializeTest(options: Test): SerializedTest;
			export function serializeTest(options: Test | undefined): SerializedTest | undefined;
			export function serializeTest(options: Test | undefined): SerializedTest | undefined {
				if (options === undefined) return undefined;
				const result: SerializedTest = {
					\\"enum\\": <ENUM>,
					\\"union\\": <UNION>,
					\\"map\\": <MAP>,
					\\"date\\": <DATE>,
					\\"array\\": <ARRAY>,
				};
			
				return result;
			}
			
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
			"const prelude = {
				id: <T>(x: T) => x,
				isNotUndefined: <T>(x: T | undefined): x is T => x !== undefined,
				serialize: <T, U>(x: T, f: (x: T extends undefined ? never : T) => U): T extends undefined ? undefined : U => {
					// @ts-ignore
					if (x === undefined) return undefined;
					//@ts-ignore
					return f(x);
				},
			};
			
			export type ABC = {
				readonly name?: string;
			};
			
			export type SerializedABC = {
				\\"name\\"?: string,
			};
			
			export function serializeABC(options: undefined): undefined;
			export function serializeABC(options: ABC): SerializedABC;
			export function serializeABC(options: ABC | undefined): SerializedABC | undefined;
			export function serializeABC(options: ABC | undefined): SerializedABC | undefined {
				if (options === undefined) return undefined;
				const result: SerializedABC = {
					\\"name\\": options.name,
				};
			
				return result;
			}
			
			"
		`);
	});

	it("should emit custom types", () => {
		const schemer = new Schemer();

		schemer.emit("MyType", (coder) => {
			coder.line("export interface MyType {}");
		});

		expect(schemer.render()).toMatchInlineSnapshot(`
			"const prelude = {
				id: <T>(x: T) => x,
				isNotUndefined: <T>(x: T | undefined): x is T => x !== undefined,
				serialize: <T, U>(x: T, f: (x: T extends undefined ? never : T) => U): T extends undefined ? undefined : U => {
					// @ts-ignore
					if (x === undefined) return undefined;
					//@ts-ignore
					return f(x);
				},
			};
			
			export interface MyType {}
			
			"
		`);
	});

	it("should handle additionalItems", () => {
		const schemer = new Schemer();

		schemer.emit("MyType", {
			type: "object",
			properties: {
				arr: {
					type: "array",
					additionalItems: {
						type: "string",
					},
				},
			},
		});

		expect(schemer.render()).toMatchInlineSnapshot(`
			"const prelude = {
				id: <T>(x: T) => x,
				isNotUndefined: <T>(x: T | undefined): x is T => x !== undefined,
				serialize: <T, U>(x: T, f: (x: T extends undefined ? never : T) => U): T extends undefined ? undefined : U => {
					// @ts-ignore
					if (x === undefined) return undefined;
					//@ts-ignore
					return f(x);
				},
			};
			
			export type MyType = {
				readonly arr?: Array<string>;
			};
			
			export type SerializedMyType = {
				\\"arr\\"?: Array<string>,
			};
			
			export function serializeMyType(options: undefined): undefined;
			export function serializeMyType(options: MyType): SerializedMyType;
			export function serializeMyType(options: MyType | undefined): SerializedMyType | undefined;
			export function serializeMyType(options: MyType | undefined): SerializedMyType | undefined {
				if (options === undefined) return undefined;
				const result: SerializedMyType = {
					\\"arr\\": prelude.serialize(options.arr, items => items.map(item => item).filter(prelude.isNotUndefined)),
				};
			
				return result;
			}
			
			"
		`);
	});

	it("should support properties and additionalProperties", () => {
		const schemer = new Schemer();

		schemer.emit("MyType", {
			type: "object",
			properties: {
				name: {
					type: "string",
				},
			},
			additionalProperties: {
				type: "object",
				properties: {
					subname: {
						type: "string",
					},
				},
				additionalProperties: {
					type: "number",
				},
			},
		});

		expect(schemer.render()).toMatchInlineSnapshot(`
			"const prelude = {
				id: <T>(x: T) => x,
				isNotUndefined: <T>(x: T | undefined): x is T => x !== undefined,
				serialize: <T, U>(x: T, f: (x: T extends undefined ? never : T) => U): T extends undefined ? undefined : U => {
					// @ts-ignore
					if (x === undefined) return undefined;
					//@ts-ignore
					return f(x);
				},
			};
			
			export type MyType = {
				readonly name?: string;
			} & Record<string, MyTypeAdditionalProperties>;
			
			export type SerializedMyType = {
				\\"name\\"?: string,
			} & Record<string, MyTypeAdditionalProperties>
			
			export function serializeMyType(options: undefined): undefined;
			export function serializeMyType(options: MyType): SerializedMyType;
			export function serializeMyType(options: MyType | undefined): SerializedMyType | undefined;
			export function serializeMyType(options: MyType | undefined): SerializedMyType | undefined {
				if (options === undefined) return undefined;
				const additionalPropertiesKeys = Object.keys(options).filter(key => ![\\"name\\"].includes(key));
			
				const additionalProperties: Record<string, any> = {};
			
				for (const key of additionalPropertiesKeys) {
					additionalProperties[key] = options[key];
				}
			
				const result: SerializedMyType = {
					\\"name\\": options.name,
					...(serializeMyTypeAdditionalProperties(additionalProperties)),
				};
			
				return result;
			}
			
			export type MyTypeAdditionalProperties = {
				readonly subname?: string;
			} & Record<string, number>;
			
			export type SerializedMyTypeAdditionalProperties = {
				\\"subname\\"?: string,
			} & Record<string, number>
			
			export function serializeMyTypeAdditionalProperties(options: undefined): undefined;
			export function serializeMyTypeAdditionalProperties(options: MyTypeAdditionalProperties): SerializedMyTypeAdditionalProperties;
			export function serializeMyTypeAdditionalProperties(options: MyTypeAdditionalProperties | undefined): SerializedMyTypeAdditionalProperties | undefined;
			export function serializeMyTypeAdditionalProperties(options: MyTypeAdditionalProperties | undefined): SerializedMyTypeAdditionalProperties | undefined {
				if (options === undefined) return undefined;
				const additionalPropertiesKeys = Object.keys(options).filter(key => ![\\"subname\\"].includes(key));
			
				const additionalProperties: Record<string, any> = {};
			
				for (const key of additionalPropertiesKeys) {
					additionalProperties[key] = options[key];
				}
			
				const result: SerializedMyTypeAdditionalProperties = {
					\\"subname\\": options.subname,
					...(additionalProperties),
				};
			
				return result;
			}
			
			"
		`);
	});
});
