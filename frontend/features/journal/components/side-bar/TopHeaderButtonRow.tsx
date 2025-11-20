import { BsArrowLeft, BsBookHalf, BsPencilFill } from "solid-icons/bs"
import { A } from "@solidjs/router"
import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AppTitleBarDraggable, Spacer, Tooltip } from "~/components"
import { useEditorContext } from "~/features/editor"

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
  const { setIsReadonly$, isReadonly$ } = useEditorContext()

  return (
    <AppTitleBarDraggable {...stylex.attrs(style.header__titleBar)}>
      <header
        {...props}
        class={MERGE_CLASS(props, stylex.attrs(style.header))}
      >
        <Tooltip label$="Go back" tooltipOptions$={{ placement: "right" }}>
          <A href="/">
            <button {...stylex.attrs(style.button)}>
              <BsArrowLeft />
            </button>
          </A>
        </Tooltip>
        <Spacer />
        <Tooltip label$="Toggle readonly." tooltipOptions$={{ placement: "right" }}>
          <button 
            {...stylex.attrs(style.button)} 
            onClick={() => setIsReadonly$(prev => !prev)}
          >
            {isReadonly$() ? <BsBookHalf /> : <BsPencilFill />}
          </button>
        </Tooltip>
      </header>
    </AppTitleBarDraggable>
  )
}