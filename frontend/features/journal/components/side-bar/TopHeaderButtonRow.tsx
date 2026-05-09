import { BsArrowLeft, BsBookHalf, BsPencilFill, BsPlus } from "solid-icons/bs"
import { A } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AppTitleBarDraggable, Button, Spacer, Tooltip } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { useJournalContext } from "../../provider"

const style = stylex.create({
  header: {
    paddingInline: 5,
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  header__titleBar: {
    width: "100%"
  },
})

export function TopHeaderButtonRow(props: HTMLAttributes<"header">) {
  const CreateJournalDialog = createLazyLoadedDialog(
    () => import("./dialog/CreateJournalDialog"),
    () => ({
      context$: useJournalContext()
    })
  )

  return (
    <AppTitleBarDraggable {...stylex.attrs(style.header__titleBar)}>
      <header
        {...props}
        class={`${stylex.attrs(style.header).class} ${props.class ?? ""}`}
      >
        <Tooltip label$="Go back" tooltipOptions$={{ placement: "right" }}>
          <A href="/">
            <Button
              variant$={ButtonVariant.NO_BACKGROUND}
              size$={ButtonSize.ICON}
              onClick={CreateJournalDialog.show$}
            >
              <BsArrowLeft />
            </Button>
          </A>
        </Tooltip>
        <Spacer />
        <Tooltip label$="Create journal">
          <Button
            variant$={ButtonVariant.NO_BACKGROUND}
            size$={ButtonSize.ICON}
            onClick={CreateJournalDialog.show$}
          >
            <BsPlus />
          </Button>
        </Tooltip>
        <Tooltip label$="Toggle readonly.">
          <Button
            variant$={ButtonVariant.NO_BACKGROUND}
            size$={ButtonSize.ICON}
            onClick={() => {}}
          >
            {true ? <BsBookHalf /> : <BsPencilFill />}
          </Button>
        </Tooltip>
      </header>

      <CreateJournalDialog.Dialog$ />
    </AppTitleBarDraggable>
  )
}