import type { ComponentProps } from "solid-js";
import type { Portal } from "solid-js/web";

export interface IDialogPortalProps extends ComponentProps<typeof Portal> {
  closeOnClickOutside$?: boolean
}