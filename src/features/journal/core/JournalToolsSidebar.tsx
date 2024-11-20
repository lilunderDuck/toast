import stylex from "@stylexjs/stylex"
import __style from "../components/tabs/Tab.module.css"

const style = stylex.create({
  sidebar: {
    width: '35%'
  }
})

export function JournalToolsSidebar() {
  return (
    <div {...stylex.attrs(style.sidebar)} id={__style.tab}>
      <div></div>
    </div>
  )
}