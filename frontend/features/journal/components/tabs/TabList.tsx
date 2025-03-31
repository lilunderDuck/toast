import { For, ParentProps } from "solid-js"
// ...
import { FlexCenterY } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useJournalContext } from "../../context"
import { tabVars } from "./tab.stylex"
import Tab from "./Tab"

const style = stylex.create({
  tabList: {
    width: '100%',
    height: tabVars.tabListThiccness,
    paddingInline: 5,
    userSelect: 'none',
    fontSize: 14
  }
})

export function TabList(props: ParentProps) {
  const { tabs$ } = useJournalContext()

  return (
    <FlexCenterY {...stylex.attrs(style.tabList)}>
      {props.children}

      <For each={tabs$.tabs$()}>
        {it => <Tab {...it} />}
      </For>
    </FlexCenterY>
  )
}