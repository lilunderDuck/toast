import { For, ParentProps } from "solid-js"
// ...
import { FlexCenterY } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from './TabList.module.css'
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { useTabContext } from "./TabProvider"

const style = stylex.create({
  tabs: {
    paddingInline: 5,
    gap: 5,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap'
  },
  tab: {
    marginTop: 8,
    width: 200,
    height: 'calc(var(--tab-title-bar-thickness) - 8px)',
    fontSize: 12,
    paddingInline: 5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    cursor: 'pointer',
    flex: '0 0 auto'
  },
  tabButFocused: {
    backgroundColor: 'var(--gray2)',
  }
})

export function TabList() {
  const { $tabs } = useTabContext()
  const [tabs] = $tabs

  return (
    <div class={mergeClassname(
      __scrollbarStyle.scrollbar,
      __scrollbarStyle.scrollbarVertical,
      __scrollbarStyle.invsScrollbar
    )}>
      <FlexCenterY {...stylex.attrs(style.tabs)}>
        <For each={tabs()}>
          {it => (
            <Tab focused={it.focused}>
              {it.name === '__NEW_TAB__' ? 'New tab' : it.name}
            </Tab>
          )}
        </For>
      </FlexCenterY>
    </div>
  )
}

interface ITabProps {
  focused?: boolean
}

function Tab(props: ParentProps<ITabProps>) {
  return (
    <div {...stylex.attrs(style.tab, props.focused ? style.tabButFocused : {})} id="tab">
      {props.children}
    </div>
  )
}