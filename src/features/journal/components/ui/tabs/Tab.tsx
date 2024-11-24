import stylex from "@stylexjs/stylex"
import { ParentProps } from "solid-js"

const style = stylex.create({
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

interface ITabProps {
  focused?: boolean
}

export function Tab(props: ParentProps<ITabProps>) {
  return (
    <div {...stylex.attrs(style.tab, props.focused ? style.tabButFocused : {})} id="tab">
      {props.children}
    </div>
  )
}