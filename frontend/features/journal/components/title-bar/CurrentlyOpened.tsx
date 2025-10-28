import { A } from "@solidjs/router"
import { BsCalendar2RangeFill, BsHouseFill, BsLayoutSidebarInset, BsWindowFullscreen } from "solid-icons/bs"
import { Show, type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Tooltip } from "~/components"

const style = stylex.create({
  currentlyOpened__wrapper: {
    display: "flex",
    alignItems: "center",
    paddingInline: 10,
    gap: 10,
    marginLeft: 15,
  },
  currentlyOpened__name: {
    fontSize: 13,
    width: "10rem",
    overflowX: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "var(--gray11)"
  }
})

export interface ICurrentlyOpenedProps {
  currentlyOpenedName$?: string
  isSidebarHidden$: boolean
  groupId$: string
  onClick$(whichOne: CurrentlyOpenedHeaderAction): void
}

export function CurrentlyOpened(props: ParentProps<ICurrentlyOpenedProps>) {
  return (
    <>
      <Tooltip label$={`${props.isSidebarHidden$ ? "Show" : "Hide"} sidebar`}>
        <button onClick={() => props.onClick$(CurrentlyOpenedHeaderAction.TOGGLE_SIDEBAR)}>
          <Show when={props.isSidebarHidden$} fallback={
            <BsLayoutSidebarInset />
          }>
            <BsWindowFullscreen />
          </Show>
        </button>
      </Tooltip>
      <div />
      <div {...stylex.attrs(style.currentlyOpened__wrapper)}>
        <Show when={props.currentlyOpenedName$} fallback={
          <button>
            <BsHouseFill />
          </button>
        }>
          <Tooltip label$="Go to this journal home page">
            <A href={`/journal/${props.groupId$}`} data-link-no-color="">
              <button>
                <BsCalendar2RangeFill />
              </button>
            </A>
          </Tooltip>
        </Show>
        <Show when={props.currentlyOpenedName$}>
          <span {...stylex.attrs(style.currentlyOpened__name)}>
            {props.currentlyOpenedName$}
          </span>
        </Show>
      </div>
    </>
  )
}