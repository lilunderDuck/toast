import { createMemo, onMount, Component } from 'solid-js'
import { defaultToastOptions, dispatch } from '../util'
import { 
  getToastWrapperStyles, 
  getWrapperYAxisOffset, 
  updateToastHeight,
  type ToastContainerProps,
  ActionType, 
  resolveValue
} from '../util'
import { ToastBar } from './ToastBar'
import __style from './Toaster.module.css'

export const ToastContainer: Component<ToastContainerProps> = (props) => {
  const calculatePosition = () => {
    const position = props.toast.position || defaultToastOptions.position
    const offset = getWrapperYAxisOffset(props.toast, position)
    const positionStyle = getToastWrapperStyles(position, offset)

    return positionStyle
  }

  const positionStyle = createMemo(() => calculatePosition())

  let el: HTMLDivElement | undefined = undefined
  onMount(() => {
    if (el) {
      updateToastHeight(el, props.toast)
    }
  })

  return (
    <div
      ref={el}
      style={positionStyle()}
      class={props.toast.visible ? __style['sldt-active'] : ''}
      onMouseEnter={() =>
        dispatch({
          type: ActionType.START_PAUSE,
          time: Date.now(),
        })
      }
      onMouseLeave={() =>
        dispatch({
          type: ActionType.END_PAUSE,
          time: Date.now(),
        })
      }
    >
      {props.toast.type === 'custom' ? (
        resolveValue(props.toast.message, props.toast)
      ) : (
        <ToastBar toast={props.toast} position={props.toast.position || defaultToastOptions.position} />
      )}
    </div>
  );
};
