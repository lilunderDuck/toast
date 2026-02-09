import { A } from "@solidjs/router"
import stylex from "@stylexjs/stylex"
import { BsArrowLeft } from "solid-icons/bs"
import { AppTitleBarDraggable, Button, Tooltip } from "~/components"

const style = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    paddingInline: 10
  }
})

interface IJournalTopHeaderProps {
  // define your component props here
}

export function JournalTopHeader(props: IJournalTopHeaderProps) {
  return (
    <AppTitleBarDraggable>
      <header {...stylex.attrs(style.header)}>
        <Tooltip label$="Go back" tooltipOptions$={{ placement: "right" }}>
          <A href="/">
            <Button
              variant$={ButtonVariant.NO_BACKGROUND}
              size$={ButtonSize.ICON}
            >
              <BsArrowLeft />
            </Button>
          </A>
        </Tooltip>
      </header>
    </AppTitleBarDraggable>
  )
}