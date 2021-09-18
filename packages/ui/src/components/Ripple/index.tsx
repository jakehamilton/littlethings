import { Ref } from "preact/hooks";
import { RippleDotProps } from "./RippleDot";

/**
 * How long it takes for the ripple to grow (and fade).
 */
const ANIMATION_DURATION = 350;

/**
 * The default bounding rectangle to use when trying to size the containing area.
 */
const DEFAULT_BOUNDING_RECT = {};

/**
 * A ripple can be triggered with the mouse, touch, or keyboard.
 */
export type RippleEvent = MouseEvent | TouchEvent | KeyboardEvent;

export interface RippleHandle {
	/**
	 * Create a ripple.
	 */
	start: (event?: RippleEvent) => void;
	/**
	 * Remove a ripple.
	 */
	stop: (event?: RippleEvent) => void;
}

export interface RippleClasses {
	root?: string;
}

export interface RippleProps {
	handleRef: Ref<RippleHandle | null>;
	center?: boolean;
	color?: string;
	classes?: RippleClasses;
	RippleDotProps?: RippleDotProps;
}

const Ripple = () => {};

export default Ripple;
