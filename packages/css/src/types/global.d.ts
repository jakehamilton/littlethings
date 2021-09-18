import { DEFAULT_SHEET_ID } from "../core/sheet";

declare global {
	interface Window {
		[DEFAULT_SHEET_ID]?: HTMLElement;
	}
}
