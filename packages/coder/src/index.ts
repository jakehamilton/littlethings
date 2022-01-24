export interface CoderOptions {
	/**
	 * The character to use for indentation.
	 */
	indentChar?: string;
	/**
	 * The number of characters to render for a single indent.
	 * When using tabs, this is typically set to `1`. When
	 * using spaces, this is typically set to `2` or `4`.
	 */
	indentAmount?: number;
}

class Coder {
	code = "";
	currentIndent: number = 0;

	indentChar: string = "\t";
	indentAmount: number = 1;

	constructor(options: CoderOptions = {}) {
		if (options?.indentChar) {
			this.indentChar = options.indentChar;
		}

		if (options?.indentAmount) {
			this.indentAmount = options.indentAmount;
		}
	}

	private getIndentText() {
		let text = "";

		for (let i = 0; i < this.currentIndent * this.indentAmount; i++) {
			text += this.indentChar;
		}

		return text;
	}

	reset() {
		this.code = "";
		this.currentIndent = 0;
	}

	line(text?: string) {
		if (text === undefined) {
			this.code += "\n";
		} else {
			this.code += this.getIndentText() + text + "\n";
		}
	}

	indent() {
		this.currentIndent++;
	}

	dedent() {
		this.currentIndent--;

		if (this.indentAmount < 0) {
			this.indentAmount = 0;
		}
	}

	openBlock(prefix: string = "") {
		this.line(prefix + " {");
		this.indent();
	}

	closeBlock(suffix: string = "") {
		this.dedent();
		this.line(`}${suffix}`);
	}
}

export default Coder;
