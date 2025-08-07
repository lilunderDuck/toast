import { A } from "@solidjs/router"
import stylex from "@stylexjs/stylex"
import { BsArchiveFill, BsCaretRightFill, BsHouseFill, BsLayoutSidebarInset } from "solid-icons/bs"
import { Show } from "solid-js"

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
    textOverflow: "ellipsis"
  }
})

interface ICurrentlyOpenedProps {
  groupId$: number
  currentlyOpenedName$?: string
}

export function CurrentlyOpened(props: ICurrentlyOpenedProps) {
  return (
    <>
      <button>
        <BsLayoutSidebarInset />
      </button>
      <div />
      <div {...stylex.attrs(style.currentlyOpened__wrapper)}>
        <button>
          <A href={`/journal/${props.groupId$}`} data-link-no-color>
            {props.currentlyOpenedName$ ? <BsArchiveFill /> : <BsHouseFill />}
          </A>
        </button>
        <Show when={props.currentlyOpenedName$}>
          <BsCaretRightFill size={10} />
          <span {...stylex.attrs(style.currentlyOpened__name)}>
            <i>{props.currentlyOpenedName$}</i>
          </span>
        </Show>
      </div>
    </>
  )
}