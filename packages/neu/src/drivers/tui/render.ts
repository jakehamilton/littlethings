// @ts-expect-error
import { YogaNode, loadYoga } from "yoga-layout";
import ansi from "ansi-escapes";
import colors from "ansi-colors";
import wrap from "wrap-ansi";
import truncate from "cli-truncate";
import stringWidth from "string-width";
import widestLine from "widest-line";

import { Signal, Source } from "~/streams/interface";
import { Dispose, subscribe } from "~/streams/sinks/subscribe";

import { VNode, VNodeStream } from "./elements";

const hexToRgb = (hex: string) => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

const availableColors = [
	"black",
	"blackBright",
	"red",
	"redBright",
	"green",
	"greenBright",
	"yellow",
	"yellowBright",
	"blue",
	"blueBright",
	"magenta",
	"magentaBright",
	"cyan",
	"cyanBright",
	"white",
	"whiteBright",
	"gray",
	"grey",
] as const;

export type Color =
	| typeof availableColors[number]
	| "transparent"
	| `#${string}`;

const ANSI_ESC = "\u001B[";
const ANSI_FOREGROUND_RESET = `${ANSI_ESC}39m`;
const ANSI_BACKGROUND_RESET = `${ANSI_ESC}49m`;

const color = (
	text: string,
	color: Omit<Color, "transparent">,
	isBackground = false,
) => {
	if (color[0] === "#") {
		// TODO: Support true color.
		throw new Error("True color support is not implemented.");
		const rgb = hexToRgb(color as string);

		if (!rgb) {
			throw new Error(`Invalid hex color: "${color}"`);
		}

		if (isBackground) {
			return `${ANSI_ESC}38;2;${rgb.r};${rgb.g};${rgb.b};${text}${ANSI_BACKGROUND_RESET}`;
		} else {
			return `${ANSI_ESC}48;2;${rgb.r};${rgb.g};${rgb.b};${text}${ANSI_FOREGROUND_RESET}`;
		}
	} else {
		if (isBackground) {
			// @ts-expect-error
			return colors[`bg${color[0].toUpperCase()}${color.substring(1)}`](text);
		} else {
			// @ts-expect-error
			return colors[color](text);
		}
	}
};

const borders = {
	line: {
		topLeft: "┌",
		topRight: "┐",
		bottomLeft: "└",
		bottomRight: "┘",
		horizontal: "─",
		vertical: "│",
	},
	lineThick: {
		topLeft: "┏",
		topRight: "┓",
		bottomLeft: "┗",
		bottomRight: "┛",
		horizontal: "━",
		vertical: "┃",
	},
	round: {
		topLeft: "╭",
		topRight: "╮",
		bottomLeft: "╰",
		bottomRight: "╯",
		horizontal: "─",
		vertical: "│",
	},
	double: {
		topLeft: "╔",
		topRight: "╗",
		bottomLeft: "╚",
		bottomRight: "╝",
		horizontal: "═",
		vertical: "║",
	},
	dashed: {
		topLeft: "┌",
		topRight: "┐",
		bottomLeft: "└",
		bottomRight: "┘",
		horizontal: "┄",
		vertical: "┆",
	},
	classic: {
		topLeft: "+",
		topRight: "+",
		bottomLeft: "+",
		bottomRight: "+",
		horizontal: "-",
		vertical: "|",
	},
} as const;

let Yoga: typeof import("yoga-layout");

export type TuiNode = {
	type: string;
	parent: TuiNode | null;
	props?: Record<string, any>;
	yoga: YogaNode;
	children: Array<TuiNode | string | null>;
};

const setProperty = (
	node: TuiNode,
	key: string,
	value: any,
	write: () => void,
): Array<Dispose> => {
	const unsubscribes: Array<Dispose> = [];

	if (key === "style" && typeof value === "function") {
		unsubscribes.push(
			subscribe((style: Record<string, any>) => {
				for (const [styleKey, styleValue] of Object.entries(style)) {
					setProperty(node, styleKey, styleValue, write);
				}
				write();
			})(value),
		);
	} else if (typeof value === "function") {
		unsubscribes.push(
			subscribe((value) => {
				setProperty(node, key, value, write);
				write();
			})(value),
		);
	} else {
		const yoga = node.yoga;

		node.props![key] = value;

		if (key === "color" || key === "background") {
			if (value === "transparent") {
				delete node.props![key];
			} else if (value[0] !== "#" && !availableColors.includes(value)) {
				throw new Error(
					`Invalid color "${value}", expected one of: ${availableColors.join(
						", ",
					)}`,
				);
			}
		} else if (key === "width" && value === "auto") {
			yoga.setWidthAuto();
		} else if (key === "height" && value === "auto") {
			yoga.setHeightAuto();
		} else if (key === "overflow") {
			if (value === "hidden") {
				yoga.setOverflow(Yoga.OVERFLOW_HIDDEN);
			} else if (value === "scroll") {
				yoga.setOverflow(Yoga.OVERFLOW_SCROLL);
			} else if (value === "visible") {
				yoga.setOverflow(Yoga.OVERFLOW_VISIBLE);
			}
		} else if (key === "flexDirection") {
			if (value === "row") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
			} else if (value === "column") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
			} else if (value === "rowReverse") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_ROW_REVERSE);
			} else if (value === "columnReverse") {
				yoga.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN_REVERSE);
			}
		} else if (key === "alignSelf") {
			if (value === "auto") {
				yoga.setAlignSelf(Yoga.ALIGN_AUTO);
			} else if (value === "flex-start") {
				yoga.setAlignSelf(Yoga.ALIGN_FLEX_START);
			} else if (value === "center") {
				yoga.setAlignSelf(Yoga.ALIGN_CENTER);
			} else if (value === "flex-end") {
				yoga.setAlignSelf(Yoga.ALIGN_FLEX_END);
			} else if (value === "stretch") {
				yoga.setAlignSelf(Yoga.ALIGN_STRETCH);
			} else if (value === "baseline") {
				yoga.setAlignSelf(Yoga.ALIGN_BASELINE);
			} else if (value === "space-between") {
				yoga.setAlignSelf(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (value === "space-around") {
				yoga.setAlignSelf(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (key === "alignContent") {
			if (value === "auto") {
				yoga.setAlignContent(Yoga.ALIGN_AUTO);
			} else if (value === "flex-start") {
				yoga.setAlignContent(Yoga.ALIGN_FLEX_START);
			} else if (value === "center") {
				yoga.setAlignContent(Yoga.ALIGN_CENTER);
			} else if (value === "flex-end") {
				yoga.setAlignContent(Yoga.ALIGN_FLEX_END);
			} else if (value === "stretch") {
				yoga.setAlignContent(Yoga.ALIGN_STRETCH);
			} else if (value === "baseline") {
				yoga.setAlignContent(Yoga.ALIGN_BASELINE);
			} else if (value === "space-between") {
				yoga.setAlignContent(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (value === "space-around") {
				yoga.setAlignContent(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (key === "alignItems") {
			if (value === "auto") {
				yoga.setAlignItems(Yoga.ALIGN_AUTO);
			} else if (value === "flex-start") {
				yoga.setAlignItems(Yoga.ALIGN_FLEX_START);
			} else if (value === "center") {
				yoga.setAlignItems(Yoga.ALIGN_CENTER);
			} else if (value === "flex-end") {
				yoga.setAlignItems(Yoga.ALIGN_FLEX_END);
			} else if (value === "stretch") {
				yoga.setAlignItems(Yoga.ALIGN_STRETCH);
			} else if (value === "baseline") {
				yoga.setAlignItems(Yoga.ALIGN_BASELINE);
			} else if (value === "space-between") {
				yoga.setAlignItems(Yoga.ALIGN_SPACE_BETWEEN);
			} else if (value === "space-around") {
				yoga.setAlignItems(Yoga.ALIGN_SPACE_AROUND);
			}
		} else if (key === "justifyContent") {
			if (value === "flex-start") {
				yoga.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
			} else if (value === "center") {
				yoga.setJustifyContent(Yoga.JUSTIFY_CENTER);
			} else if (value === "flex-end") {
				yoga.setJustifyContent(Yoga.JUSTIFY_FLEX_END);
			} else if (value === "space-evenly") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_EVENLY);
			} else if (value === "space-between") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_BETWEEN);
			} else if (value === "space-around") {
				yoga.setJustifyContent(Yoga.JUSTIFY_SPACE_AROUND);
			}
		} else if (key === "display") {
			if (value === "none") {
				yoga.setDisplay(Yoga.DISPLAY_NONE);
			} else if (value === "flex") {
				yoga.setDisplay(Yoga.DISPLAY_FLEX);
			}
		} else if (key === "position") {
			if (value === "absolute") {
				yoga.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
			} else if (value === "relative") {
				yoga.setPositionType(Yoga.POSITION_TYPE_RELATIVE);
			}
		} else if (key === "top") {
			if (typeof value === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_TOP,
					Number(value.substring(0, value.length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_TOP, value);
			}
		} else if (key === "left") {
			if (typeof value === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_LEFT,
					Number(value.substring(0, value.length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_LEFT, value);
			}
		} else if (key === "right") {
			if (typeof value === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_RIGHT,
					Number(value.substring(0, value.length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_RIGHT, value);
			}
		} else if (key === "bottom") {
			if (typeof value === "string") {
				yoga.setPositionPercent(
					Yoga.EDGE_BOTTOM,
					Number(value.substring(0, value.length - 1)),
				);
			} else {
				yoga.setPosition(Yoga.EDGE_BOTTOM, value);
			}
		} else if (key === "margin") {
			yoga.setMargin(Yoga.EDGE_ALL, value);
		} else if (key === "marginLeft") {
			yoga.setMargin(Yoga.EDGE_LEFT, value);
		} else if (key === "marginRight") {
			yoga.setMargin(Yoga.EDGE_RIGHT, value);
		} else if (key === "marginTop") {
			yoga.setMargin(Yoga.EDGE_TOP, value);
		} else if (key === "marginBottom") {
			yoga.setMargin(Yoga.EDGE_BOTTOM, value);
		} else if (key === "padding") {
			yoga.setPadding(Yoga.EDGE_ALL, value);
		} else if (key === "paddingLeft") {
			yoga.setPadding(Yoga.EDGE_LEFT, value);
		} else if (key === "paddingRight") {
			yoga.setPadding(Yoga.EDGE_RIGHT, value);
		} else if (key === "paddingTop") {
			yoga.setPadding(Yoga.EDGE_TOP, value);
		} else if (key === "paddingBottom") {
			yoga.setPadding(Yoga.EDGE_BOTTOM, value);
		} else if (key === "border") {
			yoga.setBorder(Yoga.EDGE_ALL, 1);
			node.props!.border = value;
		} else {
			const method = `set${key[0].toUpperCase()}${key.slice(1)}`;

			if (yoga[method as keyof typeof yoga]) {
				const args = [].concat(value);

				// @ts-expect-error
				yoga[method as keyof typeof yoga](...args);
			}
		}
	}

	return unsubscribes;
};

export const create = (
	parent: TuiNode,
	node: VNode,
	write: () => void,
	register: (id: string, node: TuiNode) => Dispose,
): {
	element: TuiNode | string | null;
	unsubscribes: Array<Dispose>;
} => {
	if (node === undefined || node === null) {
		return { element: null, unsubscribes: [] };
	}

	if (typeof node === "string") {
		const element: TuiNode = {
			type: "text",
			parent,
			yoga: Yoga.Node.create(),
			children: [node],
		};

		element.yoga.setMeasureFunc(
			(width, _widthMeasureMode, height, _heightMeasureMode) => {
				const style = getComputedStyle(element);

				const textHeight =
					element.props?.textWrap ?? true
						? wrap(node, width, {}).split("\n").length
						: node.split("\n").length;

				return {
					width: widestLine(node),
					height:
						style.overflow === "hidden" || style.overflow === "scroll"
							? Math.min(textHeight, height)
							: textHeight,
				};
			},
		);

		return { element, unsubscribes: [] };
	}

	const yoga = Yoga.Node.create();

	const element: TuiNode = {
		type: node.type,
		parent,
		yoga,
		props: {
			textWrap: true,
		},
		children: [],
	};

	const props = node.props ?? {};

	const unsubscribes: Array<Dispose> = [];

	for (const prop in props) {
		const result = setProperty(element, prop, props[prop], write);

		if (result.length) {
			unsubscribes.push(...result);
		}
	}

	element.yoga = yoga;

	let children: Array<VNode | VNodeStream | { tui: VNodeStream }>;

	if (typeof node.children === "function") {
		children = [node.children];
	} else if (Array.isArray(node.children)) {
		children = node.children;
	} else if (node.children != null) {
		children = [node.children];
	} else {
		children = [];
	}

	element.children = Array.from({ length: children.length }, () => null);

	for (let i = 0; i < children.length; i++) {
		let child = children[i];
		if (typeof child === "object" && child !== null && "tui" in child) {
			child = child.tui;
		}

		if (typeof child === "function") {
			let childElement: TuiNode | string | null = null;
			let childUnsubscribes: Array<Dispose> = [];

			const unsubscribe = subscribe<VNode, any>((value) => {
				const result = create(element, value, write, register);

				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				if (typeof childElement !== "string" && childElement !== null) {
					element.yoga.removeChild(childElement.yoga);
					childElement.yoga.freeRecursive();
				}

				if (result.element && typeof result.element !== "string") {
					element.yoga.insertChild(result.element.yoga, i);

					if (result.element.props?.id) {
						const id = result.element.props.id;

						unsubscribes.push(register(id, result.element));
					}
				}

				element.children[i] = result.element;

				childElement = result.element;
				childUnsubscribes = result.unsubscribes;

				write();
			})(child);

			unsubscribes.push(() => {
				for (const unsubscribe of childUnsubscribes) {
					unsubscribe();
				}

				unsubscribe();

				if (typeof childElement !== "string" && childElement !== null) {
					element.yoga.removeChild(childElement.yoga);
					childElement.yoga.freeRecursive();
				}
			});
		} else {
			const result = create(element, child, write, register);

			if (result.element) {
				if (typeof result.element !== "string") {
					element.yoga.insertChild(result.element.yoga, i);

					if (result.element.props?.id) {
						const id = result.element.props.id;

						unsubscribes.push(register(id, result.element));
					}
				}

				element.children[i] = result.element;

				unsubscribes.push(...result.unsubscribes);
			}
		}
	}

	return {
		element,
		unsubscribes,
	};
};

type OutputCharacter = {
	value: string;
	style?: Record<string, string>;
};

type ScreenOutput = Array<Array<OutputCharacter>>;

export const getBoundingClientRect = (node: YogaNode) => {
	const layout = node.getComputedLayout();

	const bounds = {
		top: layout.top,
		left: layout.left,
		right: layout.left + layout.width,
		bottom: layout.top + layout.height,
		width: layout.width,
		height: layout.height,
	};

	let parent: YogaNode | null = node;

	while ((parent = parent.getParent())) {
		const parentBounds = parent.getComputedLayout();

		bounds.left += parentBounds.left;
		bounds.top += parentBounds.top;
		bounds.right += parentBounds.right;
		bounds.bottom += parentBounds.bottom;
	}

	return bounds;
};

const getOverflowParentBoundingClientRect = (node: TuiNode) => {
	let parent = node.yoga;

	while (true) {
		const newParent = parent.getParent();

		if (!newParent) {
			break;
		}

		parent = newParent;

		if (
			parent.getOverflow() === Yoga.OVERFLOW_HIDDEN ||
			parent.getOverflow() === Yoga.OVERFLOW_SCROLL
		) {
			break;
		}
	}

	return getBoundingClientRect(parent);
};

export const getComputedStyle = (node: TuiNode) => {
	let style: Record<string, any> = {};

	if (node.parent) {
		const parentStyle = getComputedStyle(node.parent);

		if (parentStyle.color) {
			style.color = parentStyle.color;
		}

		if (parentStyle.background) {
			style.background = parentStyle.background;
		}

		if (parentStyle.bold) {
			style.bold = true;
		}

		if (parentStyle.dim) {
			style.dim = true;
		}

		if (parentStyle.italic) {
			style.italic = true;
		}

		if (parentStyle.underline) {
			style.underline = true;
		}

		if (parentStyle.strikethrough) {
			style.strikethrough = true;
		}

		if (parentStyle.textWrap) {
			style.textWrap = parentStyle.textWrap;
		}
	}

	if (node.props?.color) {
		style.color = node.props.color;
	}

	if (node.props?.background) {
		style.background = node.props.background;
	}

	if (node.props?.bold) {
		style.bold = true;
	}

	if (node.props?.dim) {
		style.dim = true;
	}

	if (node.props?.italic) {
		style.italic = true;
	}

	if (node.props?.underline) {
		style.underline = true;
	}

	if (node.props?.strikethrough) {
		style.strikethrough = true;
	}

	if (node.props?.textWrap) {
		style.textWrap = node.props.textWrap;
	}

	if (node.props?.overflow) {
		style.overflow = node.props.overflow;
	}

	if (node.props?.border) {
		style.border = node.props.border;
	}

	if (node.props?.borderColor) {
		style.borderColor = node.props.borderColor;
	}

	return style;
};

export const output = (
	node: TuiNode,
	stdout: NodeJS.WriteStream,
	screen: ScreenOutput,
	overlay = false,
	debug = false,
): Array<TuiNode> => {
	if (node.props?.display === "none") {
		return [];
	}

	if (!overlay && node.yoga.getPositionType() === Yoga.POSITION_TYPE_ABSOLUTE) {
		return [node];
	}

	if (node.type === "root") {
		let absolute: Array<TuiNode> = [];

		for (const child of node.children) {
			if (!child) {
				continue;
			}

			if (typeof child === "string") {
				stdout.write(child);
			} else {
				const result = output(child, stdout, screen, false, debug);

				if (result.length) {
					absolute.push(...result);
				}
			}
		}

		absolute = absolute.sort((a, b) => {
			if (!a.props?.zIndex && !b.props?.zIndex) {
				return 0;
			}

			if (!a.props?.zIndex) {
				return -1;
			}

			if (!b.props?.zIndex) {
				return 1;
			}

			return a.props?.zIndex - b.props?.zIndex;
		});

		for (const child of absolute) {
			output(child, stdout, screen, true, debug);
		}

		for (let y = 0; y < screen.length; y++) {
			// PERF: Optimize the use of escape sequences for colors, etc to not be on a per-character basis.
			let line = "";

			for (let x = 0; x < screen[y].length; x++) {
				const character = screen[y][x];
				let text = character.value;

				if (character.style) {
					if (character.style.color) {
						text = color(text, character.style.color, false);
					}

					if (character.style.background) {
						text = color(text, character.style.background, true);
					}

					if (character.style.bold) {
						text = colors.bold(text);
					}

					if (character.style.dim) {
						text = colors.dim(text);
					}

					if (character.style.italic) {
						text = colors.italic(text);
					}

					if (character.style.underline) {
						text = colors.underline(text);
					}

					if (character.style.strikethrough) {
						text = colors.strikethrough(text);
					}
				}

				line += text;
			}

			if (!debug) {
				stdout.write(line);
			}
		}
	} else if (node.type === "box") {
		const style = getComputedStyle(node);
		const bounds = getBoundingClientRect(node.yoga);
		const overflowBounds = getOverflowParentBoundingClientRect(node);

		for (
			let y = Math.max(bounds.top, overflowBounds.top);
			y < bounds.top + bounds.height &&
			y >= overflowBounds.top &&
			y < overflowBounds.top + overflowBounds.height &&
			y < screen.length;
			y++
		) {
			for (
				let x = Math.max(bounds.left, overflowBounds.left);
				x < bounds.left + bounds.width &&
				x >= overflowBounds.left &&
				x < overflowBounds.left + overflowBounds.width &&
				x < screen[y].length;
				x++
			) {
				screen[y][x] = {
					value: " ",
					style,
				};
			}
		}

		if (style.border && style.border !== "none") {
			const isTopOverflow = bounds.top < overflowBounds.top;
			const isBottomOverflow =
				bounds.top + bounds.height > overflowBounds.top + overflowBounds.height;
			const isLeftOverflow = bounds.left < overflowBounds.left;
			const isRightOverflow =
				bounds.left + bounds.width > overflowBounds.left + overflowBounds.width;

			if (!isTopOverflow && !isLeftOverflow) {
				screen[bounds.top][bounds.left] = {
					value: borders[style.border as keyof typeof borders].topLeft,
					style: {
						...style,
						...(style.borderColor
							? {
									color: style.borderColor,
							  }
							: {}),
					},
				};
			}

			if (!isTopOverflow && !isRightOverflow) {
				screen[bounds.top][bounds.left + bounds.width - 1] = {
					value: borders[style.border as keyof typeof borders].topRight,
					style: {
						...style,
						...(style.borderColor
							? {
									color: style.borderColor,
							  }
							: {}),
					},
				};
			}

			if (!isBottomOverflow && !isLeftOverflow) {
				screen[bounds.top + bounds.height - 1][bounds.left] = {
					value: borders[style.border as keyof typeof borders].bottomLeft,
					style: {
						...style,
						...(style.borderColor
							? {
									color: style.borderColor,
							  }
							: {}),
					},
				};
			}

			if (!isBottomOverflow && !isRightOverflow) {
				screen[bounds.top + bounds.height - 1][bounds.left + bounds.width - 1] =
					{
						value: borders[style.border as keyof typeof borders].bottomRight,
						style: {
							...style,
							...(style.borderColor
								? {
										color: style.borderColor,
								  }
								: {}),
						},
					};
			}

			for (
				let x = Math.max(bounds.left + 1, overflowBounds.left);
				x < bounds.left + bounds.width - 1 && x < screen[0].length;
				x++
			) {
				if (!isTopOverflow) {
					screen[bounds.top][x] = {
						value: borders[style.border as keyof typeof borders].horizontal,
						style: {
							...style,
							...(style.borderColor
								? {
										color: style.borderColor,
								  }
								: {}),
						},
					};
				}
				if (!isBottomOverflow) {
					screen[bounds.top + bounds.height - 1][x] = {
						value: borders[style.border as keyof typeof borders].horizontal,
						style: {
							...style,
							...(style.borderColor
								? {
										color: style.borderColor,
								  }
								: {}),
						},
					};
				}
			}

			for (
				let y = Math.max(bounds.top + 1, overflowBounds.top);
				y < bounds.top + bounds.height - 1 && y < screen.length;
				y++
			) {
				if (!isLeftOverflow) {
					screen[y][bounds.left] = {
						value: borders[style.border as keyof typeof borders].vertical,
						style: {
							...style,
							...(style.borderColor
								? {
										color: style.borderColor,
								  }
								: {}),
						},
					};
				}
				if (!isRightOverflow) {
					screen[y][bounds.left + bounds.width - 1] = {
						value: borders[style.border as keyof typeof borders].vertical,
						style: {
							...style,
							...(style.borderColor
								? {
										color: style.borderColor,
								  }
								: {}),
						},
					};
				}
			}
		}

		let absolute: Array<TuiNode> = [];

		for (const child of node.children) {
			if (!child) {
				continue;
			}

			if (typeof child === "string") {
				stdout.write(child);
			} else {
				const result = output(child, stdout, screen);

				if (result.length) {
					absolute.push(...result);
				}
			}
		}

		return absolute;
	} else if (node.type === "text") {
		let text = node.children
			.filter((child) => typeof child === "string")
			.join("");

		const style = getComputedStyle(node);
		const bounds = getBoundingClientRect(node.yoga);
		const overflowBounds = getOverflowParentBoundingClientRect(node);

		const lines = style?.textWrap
			? wrap(text, bounds.width, {
					trim: false,
					hard: true,
			  }).split("\n")
			: text.split("\n");

		if (style.textWrap) {
			let position = lines[0].length;

			for (let i = 1; i < lines.length; i++) {
				const line = lines[i];

				if (line[0] === " " && text[position] !== "\n") {
					lines[i] = line.substring(1);
				}

				position += lines[i].length;
			}
		}

		for (let y = 0; y < lines.length; y++) {
			if (
				y + bounds.top < overflowBounds.top ||
				y + bounds.top >= overflowBounds.top + overflowBounds.height ||
				y + bounds.top >= screen.length
			) {
				continue;
			}

			if (style?.overflow === "hidden" && y >= bounds.height) {
				break;
			}

			const line = lines[y];
			for (let x = 0; x < line.length; x++) {
				if (
					x + bounds.left < overflowBounds.left ||
					x + bounds.left >= overflowBounds.left + overflowBounds.width ||
					x + bounds.left >= screen[y + bounds.top].length
				) {
					continue;
				}

				if (style?.overflow === "hidden" && x >= bounds.width) {
					break;
				}

				const character = line[x];

				screen[bounds.top + y][bounds.left + x] = {
					value: character,
					style,
				};
			}
		}
	}

	return [];
};

export const render = async (
	stdin: NodeJS.ReadStream,
	stdout: NodeJS.WriteStream,
	source: Source<any>,
	register: (id: string, node: TuiNode) => Dispose,
	debug = false,
) => {
	Yoga = await loadYoga();

	let unsubscribes: Array<Dispose> = [];

	const root: TuiNode = {
		type: "root",
		parent: null,
		yoga: Yoga.Node.create(),
		children: [],
	};

	root.yoga.setWidth(stdout.columns);
	root.yoga.setHeight(stdout.rows);

	let isFirstWrite = true;

	if (!debug) {
		stdout.write(ansi.cursorHide);
		stdout.write(ansi.enterAlternativeScreen);
	}

	const cleanup = () => {
		stdout.write(ansi.cursorShow);
		stdout.write(ansi.exitAlternativeScreen);
	};

	stdout.addListener("close", cleanup);
	process.addListener("exit", cleanup);
	process.addListener("SIGINT", cleanup);
	process.addListener("SIGTERM", cleanup);

	const measure = () => {
		root.yoga.calculateLayout(stdout.columns, stdout.rows, Yoga.DIRECTION_LTR);
	};

	const write = () => {
		measure();

		const screen: ScreenOutput = Array.from({ length: stdout.rows }, () => {
			return Array.from({ length: stdout.columns }, () => {
				return { value: " " };
			});
		});

		if (!isFirstWrite && !debug) {
			stdout.write(ansi.clearScreen);
		}

		output(root, stdout, screen, false, debug);

		// NOTE: Without this, resizing does not properly rerender the output at the beginning of the screen.
		stdout.write(ansi.cursorTo(0, 0));
	};

	stdout.addListener("resize", () => {
		root.yoga.setWidth(stdout.columns);
		root.yoga.setHeight(stdout.rows);

		write();
	});

	source(Signal.Start, (type, data) => {
		if (type === Signal.Data) {
			for (const unsubscribe of unsubscribes) {
				unsubscribe();
			}

			for (const child of root.children) {
				if (typeof child === "object" && child !== null) {
					root.yoga.removeChild(child.yoga);
					child.yoga.freeRecursive();
				}
			}

			root.children = [];

			const result = create(root, data, write, register);

			if (result.element && typeof result.element !== "string") {
				root.yoga.insertChild(result.element.yoga, 0);
			}

			unsubscribes = result.unsubscribes;
			root.children = [result.element];

			write();
		}
	});

	return measure;
};
