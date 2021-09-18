import { getSheet, SSRSheet } from "./sheet";

/**
 * Extract CSS after performing SSR
 *
 * **NOTE**: This can only be used on the server side
 */
export const extractCSS = (target?: Element) => {
	const sheet = getSheet(target);

	const { data } = sheet;

	sheet.data = "";

	return data;
};

export const update = (
	css: string,
	sheet: Text | SSRSheet,
	append?: boolean
) => {
	if (sheet.data.indexOf(css) === -1) {
		if (append) {
			sheet.data = css + sheet.data;
		} else {
			sheet.data = sheet.data + css;
		}
	}
};
