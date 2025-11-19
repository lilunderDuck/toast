import type { ValidComponent } from "solid-js"
import { Show, splitProps } from "solid-js"
 
import type { DynamicProps, HandleProps, RootProps } from "@corvu/resizable"
import ResizablePrimitive from "@corvu/resizable"
import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"
 
const style = stylex.create({
  resizable: {
    display: 'flex'
  },
  resizableHandle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    width: 2,
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'var(--blue10)',
    }
  },
  resiableIconHandle: {
    display: "flex",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.125rem",
    borderWidth: 1,
    width: "0.75rem",
    height: "1rem"
  }
})
 
export type ResizableProps<T extends ValidComponent = "div"> = RootProps<T> & { class?: string }
 
export function Resizable<T extends ValidComponent = "div">(props: DynamicProps<T, ResizableProps<T>>) {
  const [, rest] = splitProps(props as ResizableProps, ["class"])
  return (
    <ResizablePrimitive
      {...rest}
      class={MERGE_CLASS(
        props,
        stylex.attrs(style.resizable)
      )}
    />
  )
}

export type ResizablePanelProps = Parameters<typeof ResizablePrimitive['Panel']>[0]
 
export const ResizablePanel = ResizablePrimitive.Panel
 
export type ResizableHandleProps<T extends ValidComponent = "button"> = HandleProps<T> & {
  class?: string
  withHandle?: boolean
}
 
export function ResizableHandle<T extends ValidComponent = "button">(
  props: DynamicProps<T, ResizableHandleProps<T>>
) {
  const [, rest] = splitProps(props as ResizableHandleProps, ["class", "withHandle"])
  return (
    <ResizablePrimitive.Handle
      {...rest}
      class={MERGE_CLASS(
        props,
        stylex.attrs(style.resizableHandle)
      )}
    >
      <Show when={props.withHandle}>
        <div class={MERGE_CLASS(stylex.attrs(style.resiableIconHandle))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2.5"
          >
            <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
        </div>
      </Show>
    </ResizablePrimitive.Handle>
  )
}