import { type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AppTitleBarDraggable } from "~/components"

const style = stylex.create({
  currentlyOpenedHeader__wrapper: {
    display: "flex",
    alignItems: "center",
    paddingInline: 10,
    gap: 10,
    marginLeft: 15,
    flexShrink: 0
  },
  currentlyOpenedHeader__name: {
    fontSize: 13,
    width: "10rem",
    overflowX: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "var(--gray11)",
    flexShrink: 0
  },
  header: {
    paddingLeft: 10,
    backgroundColor: "var(--sidebar-panel-bg)"
  }
})

export interface ICurrentlyOpenedHeaderProps extends IActionHandler<CurrentlyOpenedHeaderAction> {
  isSidebarHidden$: boolean
  groupId$: string
  id?: string
}

export function CurrentlyOpenedHeader(props: ParentProps<ICurrentlyOpenedHeaderProps>) {
  return (
    <AppTitleBarDraggable {...stylex.attrs(style.header)} id={props.id}>
      {props.children}
      <div />
      {/* <div {...stylex.attrs(style.currentlyOpenedHeader__wrapper)}>
        <Show when={props.currentlyOpenedHeaderName$} fallback={
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
        <Show when={props.currentlyOpenedHeaderName$}>
          <span {...stylex.attrs(style.currentlyOpenedHeader__name)}>
            {props.currentlyOpenedHeaderName$}
          </span>
        </Show>
      </div> */}
    </AppTitleBarDraggable>
  )
}