import { BsArrowLeft } from "solid-icons/bs"
import { A } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { macro_mergeClassnames } from "macro-def"
import { AppTitleBarDraggable, Spacer, Tooltip } from "~/components"

const style = stylex.create({
  header: {
    paddingInline: 5,
    width: "100%",
    display: "flex",
    alignItems: "center"
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
        class={macro_mergeClassnames(
          props,
          stylex.attrs(style.header)
        )}
      >
        <Tooltip label$="Go back" tooltipOptions$={{ placement: "right" }}>
          <A href="/">
            <button {...stylex.attrs(style.button)}>
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