import { For, ParentProps } from "solid-js"
// ...
import { FlexCenterY } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TabList.module.css"
// ...
import { useJournalContext } from "../../context"
import Tab from "./Tab"

const style = stylex.create({
  tabList: {
    width: '100%',
    height: "var(--tab-list-thiccness)",
    paddingInline: 5,
    userSelect: 'none',
    fontSize: 14
  }
})

export function TabList(props: ParentProps) {
  const { tabs$ } = useJournalContext()

  return (
    <FlexCenterY {...stylex.attrs(style.tabList)} id={__style.tabs}>
      {props.children}

      <For each={tabs$.tabs$()}>
        {it => <Tab {...it} />}
      </For>
    </FlexCenterY>
  )
}