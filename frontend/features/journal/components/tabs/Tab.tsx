import { Show } from "solid-js"
import { BsX } from "solid-icons/bs"
// ...
import { FlexCenterY, Spacer, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type TabData, useJournalContext } from "../../context"
import { tabVars } from "./tab.stylex"

const style = stylex.create({
  tab: {
    width: '10rem',
    marginTop: tabVars.tabTopMargin,
    height: tabVars.tabThiccness,
    backgroundColor: "var(--gray2)",
    paddingInline: 12,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  closeIcon: {
    width: `calc(${tabVars.tabThiccness} - 5px)`,
    height: `calc(${tabVars.tabThiccness} - 5px)`,
    padding: 4,
    borderRadius: 6,
    color: "var(--gray11)",
    cursor: "pointer",
    transition: "0.25s ease-out",
    ":hover": {
      backgroundColor: "var(--gray5)",
      color: "var(--gray11)",
    }
  },
  focusTab: {
    backgroundColor: "var(--gray2)",
  },
  notFocusedTab: {
    backgroundColor: "var(--gray4)",
  }
})

export default function Tab(props: TabData) {
  const { tabs$, journal$ } = useJournalContext()

  const isFocused = () => journal$.currentlyOpened$()?.id === props.journalId$
  
  return (
    <FlexCenterY {...stylex.attrs(
      style.tab,
      isFocused() ? style.focusTab : style.notFocusedTab
    )}>
      {props.name$}
      <Spacer />
      <Show when={tabs$.tabs$().length !== 1}>
        <Tooltip label$="Close this tab">
          <BsX {...stylex.attrs(style.closeIcon)} />
        </Tooltip>
      </Show>
    </FlexCenterY>
  )
}