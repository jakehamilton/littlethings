import Coder from "@littlethings/coder";
import { JSONSchema4 } from "json-schema";

import * as serializers from "./serializers";
import * as generators from "./generators";

import type { UnionGeneratorOptions } from "./generators/union";
import type { EnumGeneratorOptions } from "./generators/enum";
import type { StructGeneratorOptions } from "./generators/struct";
import type { PatternGeneratorOptions } from "./generators/pattern";

import { isDate } from "./util/date";
import { Enum, isEnum } from "./util/enum";
import { camel, normalize, pascal } from "./util/formatting";
import { id } from "./util/id";
import { isMap } from "./util/map";
import { DEFINITIONS_PREFIX, isRef, Ref, removeRefPrefix } from "./util/ref";
import { Serialize } from "./util/serializer";
import { isStruct, Struct } from "./util/struct";
import { Type } from "./util/type";
import {
	getUnionOptions,
	isUnion,
	isValidUnionOption,
	Union,
} from "./util/union";
import { isPattern, Pattern } from "./util/pattern";

export type Schema = JSONSchema4;

export interface Schemas {
	[key: string]: JSONSchema4;
}

export interface Serializers {
	name: Serialize;
	union: Serialize;
	date: Serialize;
	enum: Serialize;
	struct: (name: string) => Serialize;
	array: (type: Type) => Serialize;
	map: (type: Type) => Serialize;
}

export interface Generators {
	union: (options: UnionGeneratorOptions) => void;
	enum: (options: EnumGeneratorOptions) => void;
	struct: (options: StructGeneratorOptions) => void;
	pattern: (options: PatternGeneratorOptions) => void;
}

export type TypeEmitter = (coder: Coder) => Type | void;

export interface TypeEmitters {
	[key: string]: TypeEmitter;
}

export interface Types {
	[key: string]: Type;
}

export interface SchemerOptions {
	schemas?: Schemas;
	serializers?: Partial<Serializers>;
	generators?: Partial<Generators>;
}

class Schemer {
	schemas: Schemas = {};
	emitters: TypeEmitters = {};
	types: Types = {};
	serializers: Serializers = { ...serializers };
	generators: Generators = { ...generators };

	constructor(options: SchemerOptions = {}) {
		if (options.schemas) {
			this.schemas = options.schemas;
		}

		if (options.serializers) {
			for (const [name, serializer] of Object.entries(
				options.serializers
			)) {
				// TypeScript doesn't like `Object.entries` and doesn't
				// properly infer the relationship between `name` and
				// `serializer`.
				// @ts-expect-error
				this.serializers[name] = serializer;
			}
		}

		if (options.generators) {
			for (const [name, generator] of Object.entries(
				options.generators
			)) {
				// TypeScript doesn't like `Object.entries` and doesn't
				// properly infer the relationship between `name` and
				// `generator`.
				// @ts-expect-error
				this.generators[name] = generator;
			}
		}
	}

	render() {
		const coder = new Coder();

		while (Object.keys(this.emitters).length > 0) {
			const key = Object.keys(this.emitters)[0];
			const emitter = this.emitters[key];
			const type = emitter(coder);

			coder.line();

			delete this.emitters[key];

			if (type) {
				this.types[key] = type;
			}
		}

		return coder.code;
	}

	define(name: string, schema: JSONSchema4) {
		this.schemas[name] = schema;
	}

	alias(source: string, target: string) {
		this.schemas[source] = {
			$ref: `${DEFINITIONS_PREFIX}${target}`,
		};
	}

	emit(name: string, schema?: JSONSchema4): Type;
	emit(name: string, emitter: TypeEmitter): void;
	emit(
		name: string,
		schemaOrEmitter?: JSONSchema4 | TypeEmitter
	): Type | void {
		if (typeof schemaOrEmitter === "function") {
			// type emitter
			if (this.types.hasOwnProperty(name)) {
				// this type was already produced
				return;
			}

			// Renamed to make it clear we only have an emitter here.
			const emitter = schemaOrEmitter;

			this.emitters[name] = (coder) => {
				const result = emitter(coder);

				if (result) {
					return result;
				} else {
					return {
						type: name,
						serialize: id,
					};
				}
			};
		} else {
			// schema
			if (normalize(name) !== name) {
				throw new Error(
					`Name "${name}" must be normalized to "${normalize(
						name
					)}" before emitting.`
				);
			}

			// Renamed to make it clear we only have a schema here.
			const schema = schemaOrEmitter || this.schemas[name];

			if (!schema) {
				throw new Error(`No schema found for "${name}".`);
			}

			// @NOTE(jakehamilton): Handle $ref
			if (isRef(schema)) {
				return this.ref(schema);
			}

			// @NOTE(jakehamilton): Handle unions
			if (isUnion(schema)) {
				const union = this.union(name, schema);

				if (union) {
					return union;
				}
			}

			// @NOTE(jakehamilton): Handle dates
			if (isDate(schema)) {
				if (schema.type && schema.type !== "string") {
					throw new Error(
						`Expected date-time type to be "string", but got "${schema.type}".`
					);
				}

				return {
					type: "Date",
					serialize: this.serializers.date,
				};
			}

			// @NOTE(jakehamilton): Handle enums
			if (isEnum(schema)) {
				if (schema.type && schema.type !== "string") {
					throw new Error(
						`Expected enum type to be "string", but got "${schema.type}".`
					);
				}

				return this.enum(name, schema);
			}

			// @NOTE(jakehamilton): Handle structs
			if (isStruct(schema)) {
				if (schema.type && schema.type !== "object") {
					throw new Error(
						`Expected struct type to be "object", but got "${schema.type}".`
					);
				}

				return this.struct(name, schema);
			}

			// @NOTE(jakehamilton): Handle maps
			if (isMap(schema)) {
				if (schema.type && schema.type !== "object") {
					throw new Error(
						`Expected map type to be "object", but got "${schema.type}".`
					);
				}

				const type = this.emit(name, schema.additionalProperties);
				return {
					type: `{ [key: string]: ${type.type} }`,
					serialize: this.serializers.map(type),
				};
			}

			// @NOTE(jakehamilton): Handle string regex patterns
			if (isPattern(schema)) {
				return this.pattern(name, schema);
			}

			switch (schema.type) {
				// @NOTE(jakehamilton): Handle strings
				case "string":
					return {
						type: "string",
						serialize: id,
					};

				// @NOTE(jakehamilton): Handle numbers & integers
				case "number":
				case "integer":
					return {
						type: "number",
						serialize: id,
					};

				// @NOTE(jakehamilton): Handle booleans
				case "boolean":
					return {
						type: "boolean",
						serialize: id,
					};

				// @TODO(jakehamilton): Handle arrays
				case "array":
					return this.array(name, schema);
			}

			// @NOTE(jakehamilton): Handle `any` fallthrough
			return {
				type: "any",
				serialize: id,
			};
		}
	}

	ref(schema: Ref) {
		if (!schema.$ref.startsWith(DEFINITIONS_PREFIX)) {
			throw new Error(
				`Expected $ref to start with ${DEFINITIONS_PREFIX}, but got "${schema.$ref}".`
			);
		}

		const unprefixedName = removeRefPrefix(schema.$ref);
		const serializedName = this.serializers.name(unprefixedName);

		const name = normalize(serializedName);

		// Already generated
		if (this.types[name]) {
			return this.types[name];
		}

		const resolvedSchema = this.schemas[unprefixedName];

		if (!resolvedSchema) {
			throw new Error(`Unable to resolve $ref for "${unprefixedName}".`);
		}

		return this.emit(name, resolvedSchema);
	}

	union(name: string, schema: Union) {
		const options: Array<string> = [];

		for (const option of getUnionOptions(schema)) {
			if (!isValidUnionOption(option)) {
				return;
			}

			// Convert "integer" to "number" so we can render the type
			const type = option.type === "integer" ? "number" : option.type;

			options.push(type);
		}

		const type: Type = {
			type: name,
			serialize: this.serializers.union,
		};

		this.emit(name, (coder) => {
			this.generators.union({
				coder,
				name,
				options,
			});

			return type;
		});

		return type;
	}

	enum(name: string, schema: Enum) {
		const type: Type = {
			type: name,
			serialize: this.serializers.enum,
		};

		this.emit(name, (coder) => {
			this.generators.enum({
				coder,
				name,
				members: schema.enum,
			});
			return type;
		});

		return type;
	}

	struct(name: string, schema: Struct) {
		const type: Type = {
			type: name,
			serialize: this.serializers.struct(name),
		};

		this.emit(name, (coder) => {
			this.generators.struct({
				coder,
				name,
				schema,
				serializers: this.serializers,
				emit: this.emit.bind(this),
			});

			return type;
		});

		return type;
	}

	array(name: string, schema: JSONSchema4): Type {
		if (
			!schema.hasOwnProperty("items") ||
			typeof schema.items !== "object"
		) {
			throw new Error(
				`Expected array items to be "object", but got "${typeof schema.items}".`
			);
		}

		const type = this.emit(name, schema.items);

		return {
			type: `Array<${type.type}>`,
			serialize: this.serializers.array(type),
		};
	}

	pattern(name: string, schema: Pattern): Type {
		const type: Type = {
			type: name,
			serialize: id,
		};

		this.emit(name, (coder) => {
			this.generators.pattern({
				coder,
				name,
				pattern: schema.pattern,
			});
			return type;
		});

		return type;
	}
}

export default Schemer;

export {
	normalize,
	camel,
	pascal,
	isEnum,
	isStruct,
	isUnion,
	isPattern,
	isDate,
	isMap,
	id,
};

export type {
	Type,
	Enum,
	Struct,
	Union,
	Pattern,
	UnionGeneratorOptions,
	EnumGeneratorOptions,
	StructGeneratorOptions,
	PatternGeneratorOptions,
};
