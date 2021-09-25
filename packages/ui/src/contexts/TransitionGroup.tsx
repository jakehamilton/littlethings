import { createContext, FunctionComponent } from "preact";

export interface TransitionGroupContextValue {
	isMounting: boolean;
}

export const TransitionGroupContext = createContext<TransitionGroupContextValue>(
	{
		isMounting: false,
	}
);
