import type { ValidComponent } from "solid-js"
import { Show, splitProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import type { DynamicProps, HandleProps, RootProps } from "@corvu/resizable"
import ResizablePrimitive from "@corvu/resizable"
 
const resizable = css`
  display: flex;
`

const resizable__handle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  width: 2px;
  background-color: transparent;
  &:hover {
    background-color: var(--blue10);
  }
`

const resiable__iconHandle = css`
  display: flex;
  z-index: 10;
  justify-content: center;
  align-items: center;
  border-radius: 0.125rem;
  border-width: 1px;
  width: 0.75rem;
  height: 1rem;
`

export type ResizableProps<T extends ValidComponent = "div"> = RootProps<T> & { class?: string }
 
export function Resizable<T extends ValidComponent = "div">(props: DynamicProps<T, ResizableProps<T>>) {
  const [, rest] = splitProps(props as ResizableProps, ["class"])
  return (
    <ResizablePrimitive
      {...rest}
      class={`${resizable} ${props.class ?? ""}`}
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
      class={`${resizable} ${props.class ?? ""}`}
    >
      <Show when={props.withHandle}>
        <div class={resiable__iconHandle}>
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