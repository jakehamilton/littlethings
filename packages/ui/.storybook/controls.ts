import { ThemeColorName, ThemePaletteColorName } from "../src/types/theme";

type BooleanControl = {
	type: "boolean";
};

type NumberControl = {
	type: "number";
	min?: number;
	max?: number;
	step?: number;
};

type RangeControl = {
	type: "range";
	min?: number;
	max?: number;
	step?: number;
};

type ObjectControl = {
	type: "object";
};

type FileControl = {
	type: "file";
	accept?: string;
};

type RadioControl = {
	type: "radio";
};

type InlineRadioControl = {
	type: "inline-radio";
};

type CheckControl = {
	type: "check";
};

type InlineCheckControl = {
	type: "inline-check";
};

type SelectControl = {
	type: "select";
	labels: {
		[key: string]: string;
	};
};

type SelectControlConfig = {
	options: Array<any>;
};

type MultiSelectControl = {
	type: "multi-select";
	labels: {
		[key: string]: string;
	};
};

type TextControl = {
	type: "text";
};

type ColorControl = {
	type: "color";
};

type DateControl = {
	type: "date";
};

type Control =
	| BooleanControl
	| NumberControl
	| RangeControl
	| ObjectControl
	| FileControl
	| RadioControl
	| InlineRadioControl
	| CheckControl
	| InlineCheckControl
	| SelectControl
	| MultiSelectControl
	| TextControl
	| ColorControl
	| DateControl;

type Config<C extends Control, P extends object = {}> = {
	name?: string;
	defaultValue?: any;
	description?: string;
	control?: C;
} & P;

type ConfigWithoutType<
	C extends Omit<Control, "type">,
	P extends object = {}
> = {
	name?: string;
	defaultValue?: any;
	description?: string;
	control?: C;
} & P;

type Helper<Ctrl extends Control, P extends object = {}> = (
	config?: ConfigWithoutType<Ctrl, P>
) => Config<Ctrl, P>;

const spread = <C extends Control, P extends Record<string, any> = {}>(
	type: C["type"]
): Helper<C, P> => (config = {} as ConfigWithoutType<C, P>) => ({
	...config,
	control: {
		...config?.control,
		type,
	},
});

export const disable = (config: Config<Control> = {}) => ({
	...config,
	control: false,
});

export const boolean = spread<BooleanControl>("boolean");

export const number = spread<NumberControl>("number");

export const range = spread<RangeControl>("range");

export const object = spread<ObjectControl>("object");

export const file = spread<FileControl>("file");

export const radio = spread<RadioControl>("radio");

export const inlineRadio = spread<InlineRadioControl>("inline-radio");

export const check = spread<CheckControl>("check");

export const inlineCheck = spread<InlineCheckControl>("inline-check");

export const select = spread<SelectControl, SelectControlConfig>("select");

export const multiSelect = spread<MultiSelectControl, SelectControlConfig>(
	"multi-select"
);

export const text = spread<TextControl>("text");

export const color = spread<ColorControl>("color");

export const date = spread<DateControl>("date");

export const themeColor = <P extends Record<string, any> = {}>(
	defaultColor: ThemeColorName,
	config?: ConfigWithoutType<SelectControl, P>
) => {
	const colors = ["primary", "secondary", "background", "disabled"]
		.map((name) => [
			name,
			`${name}.light`,
			`${name}.main`,
			`${name}.dark`,
			`${name}.text`,
		])
		.flat() as Array<ThemeColorName>;

	return select({
		defaultValue: defaultColor,
		options: colors,
		...config,
		control: {
			...config?.control,
		},
	});
};

export const action = (name: string) => {
	return {
		action: name,
	};
};
