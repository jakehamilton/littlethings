export const isMouseEvent = (event: any): event is MouseEvent =>
	event && event instanceof MouseEvent;

export const isTouchEvent = (event: any): event is TouchEvent =>
	event && event.hasOwnProperty("touches");

export const isKeyboardEvent = (event: any): event is KeyboardEvent =>
	event && event instanceof KeyboardEvent;
