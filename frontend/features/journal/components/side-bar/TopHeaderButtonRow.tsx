import { BsArrowLeft, BsHouseFill, BsPencilFill } from "solid-icons/bs"
// ...
import { shorthands } from "~/styles/shorthands"
import stylex from "@stylexjs/stylex"
// ...
import { mergeClassname } from "~/utils"
import { ButtonRow, INSERT_SPACER_HERE } from "./ButtonRow"
import { AppTitleBarDraggable, Spacer, Tooltip } from "~/components"
import { A } from "@solidjs/router"

const style = stylex.create({
  header: {
    paddingInline: 5,
    width: "100%"
  },
  header__titleBar: {
    width: "100%"
  },
  button: {
    padding: 0,
    width: 25,
    height: 25,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: "var(--gray10)",
    ":hover": {
      backgroundColor: "var(--gray4)",
      color: "var(--gray12)",
    }
  }
})

export function TopHeaderButtonRow(props: HTMLAttributes<"header">) {
  return (
    <AppTitleBarDraggable {...stylex.attrs(style.header__titleBar)}>
      <header
        {...props}
        class={mergeClassname(
          props,
          stylex.attrs(style.header, shorthands.flex_y_center$)
        )}
      >
        <Tooltip label$="Go back" tooltipOptions$={{ placement: "right" }}>
          <A href="/">
            <button {...stylex.attrs(style.button, shorthands.flex_center$)}>
              <BsArrowLeft />
            </button>
          </A>
        </Tooltip>
        <Spacer />
        {/* <Tooltip label$="Toggle edit mode." tooltipOptions$={{ placement: "right" }}>
          <button {...stylex.attrs(style.button, shorthands.flex_center$)}>
            <BsPencilFill />
          </button>
        </Tooltip> */}
      </header>
    </AppTitleBarDraggable>
  )
}