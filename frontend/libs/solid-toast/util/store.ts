import { Toast } from './toast';

export type Action =
  | {
      type: ToastActionType.ADD_TOAST;
      toast: Toast;
    }
  | {
      type: ToastActionType.UPSERT_TOAST;
      toast: Toast;
    }
  | {
      type: ToastActionType.UPDATE_TOAST;
      toast: Partial<Toast>;
    }
  | {
      type: ToastActionType.DISMISS_TOAST;
      toastId?: string;
    }
  | {
      type: ToastActionType.REMOVE_TOAST;
      toastId?: string;
    }
  | {
      type: ToastActionType.START_PAUSE;
      time: number;
    }
  | {
      type: ToastActionType.END_PAUSE;
      time: number;
    };
// ...
export interface State {
  toasts: Toast[];
  pausedAt: number | undefined;
}