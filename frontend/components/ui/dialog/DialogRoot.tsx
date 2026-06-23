import { createEffect, createSignal, type ParentProps } from "solid-js";
// ...
import {
  DialogContext, 
  type DialogContextValue
} from "./DialogContext";
import { DEBUG_INFO_LABEL } from "macro-def";

export interface DialogRootOptions {
	/** The controlled open state of the dialog. */
	open$: boolean;

	/**
	 * The default open state when initially rendered.
	 * Useful when you do not need to control the open state.
	 */
	defaultOpen$: boolean;

	/** Event handler called when the open state of the dialog changes. */
	onOpenChange$: (isOpen: boolean) => void;

	/** Whether the scroll should be locked even if the dialog is not modal. */
	preventScroll$: boolean;

	/**
	 * Used to force mounting the dialog (portal, overlay and content) when more control is needed.
	 * Useful when controlling animation with SolidJS animation libraries.
	 */
	forceMount$: boolean;
}

/**
 * A dialog is a window overlaid on either the primary window or another dialog window.
 */
export function Dialog(props: ParentProps<Partial<DialogRootOptions>>) {
	const [isDialogOpen, setIsDialogOpen] = createSignal((props.open$ || props.defaultOpen$) ?? false)

	createEffect(() => {
		setIsDialogOpen(props.open$ ?? false)
		DEBUG_INFO_LABEL("Dialog", "open state changed to", props.open$)
	})

	const context: DialogContextValue = {
		isOpen$: isDialogOpen,
		close$() {
			setIsDialogOpen(false)
		}
	};

	return (
		<DialogContext.Provider value={context}>
			{props.children}
		</DialogContext.Provider>
	);
}