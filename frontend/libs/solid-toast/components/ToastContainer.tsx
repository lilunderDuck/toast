import { createMemo, onMount, type Component } from 'solid-js'
// ...
import { defaultToastOptions, dispatch } from '../util'
import { 
  getToastWrapperStyles, 
  getWrapperYAxisOffset, 
  updateToastHeight,
  type ToastContainerProps,
  resolveValue
} from '../util'
import { ToastBar } from './ToastBar'
import __style from './Toaster.module.css'
import { MERGE_CLASS } from 'macro-def'

export const ToastContainer: Component<ToastContainerProps> = (props) => {
  const calculatePosition = () => {
    const position = props.toast.position || defaultToastOptions.position
    const offset = getWrapperYAxisOffset(props.toast, position)
    const positionStyle = getToastWrapperStyles(position)

    return {
      class: positionStyle.class,
      offset
    }
  }

  const positionStyle = createMemo(() => calculatePosition())

  let el!: Ref<"div">
  onMount(() => {
    if (el) {
      updateToastHeight(el, props.toast)
    }
  })

  return (
    <div
      ref={el}
      style={{
        '--offset': positionStyle().offset
      }}
      class={MERGE_CLASS(
        props.toast.visible ? `${__style['sldt-active']} data-component-toast-visible` : 'data-component-toast-hidden',
        positionStyle()
      )}
      onMouseEnter={() =>
        dispatch({
          type: ToastActionType.START_PAUSE,
          time: Date.now(),
        })
      }
      onMouseLeave={() =>
        dispatch({
          type: ToastActionType.END_PAUSE,
          time: Date.now(),
        })
      }
    >
      {props.toast.type === ToastType.CUSTOM ? (
        resolveValue(props.toast.message, props.toast)
      ) : (
        <ToastBar toast={props.toast} position={props.toast.position || defaultToastOptions.position} />
      )}
    </div>
  );
};