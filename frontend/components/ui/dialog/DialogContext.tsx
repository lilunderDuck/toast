import { DEBUG_ASSERT } from "macro-def";
import {
	type Accessor,
	createContext,
	useContext,
} from "solid-js";

export const DIALOG_INTL_TRANSLATIONS = {
	dismiss: "Dismiss",
};

export type DialogIntlTranslations = typeof DIALOG_INTL_TRANSLATIONS;

export interface DialogContextValue {
	isOpen$: Accessor<boolean>;
	close$: () => void;
	toggle$: () => void;
}

export const DialogContext = createContext<DialogContextValue>();

export function useDialogContext() {
	const context = useContext(DialogContext)!;
  DEBUG_ASSERT(context, `useDialogContext must be used within a Dialog component`)
	return context;
}