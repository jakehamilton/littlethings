import { Serialize } from "./serializer";

export interface Type {
	type: string;
	serialize: Serialize;
}
