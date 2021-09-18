const AMPERSAND = /&/;
const ALL_AMPERSAND = /&/g;
const EVERYTHING_BUT_COMMA = /([^,])+/g;

export const composeSelectors = (
	firstSelector: string,
	secondSelector: string
): string => {
	// Replace selectors in a comma-separated list with the new class name
	const result = firstSelector.replace(
		EVERYTHING_BUT_COMMA,
		(firstSelectorSubstring) => {
			// Replace selectors in the second selector comma-separated list with the new class name
			return secondSelector.replace(
				EVERYTHING_BUT_COMMA,
				(secondSelectorSubstring) => {
					// If the selector has "&" in it, fill in the selector
					if (AMPERSAND.test(secondSelectorSubstring)) {
						return secondSelectorSubstring.replace(
							ALL_AMPERSAND,
							firstSelectorSubstring
						);
					}

					// Prepend the second selector with the first if it exists
					if (firstSelectorSubstring) {
						return `${firstSelectorSubstring} ${secondSelectorSubstring}`;
					} else {
						return secondSelectorSubstring;
					}
				}
			);
		}
	);

	return result;
};
