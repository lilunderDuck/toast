import { onCleanup, type ParentProps } from "solid-js"
import { Root } from "@corvu/resizable"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalRootPanel.module.css"

const style = stylex.create({
  home: {
    width: "100%",
    height: "100%"
  },
})

interface IJournalRootPanelProps {
  // define your component props here
}

export function JournalRootPanel(props: ParentProps<IJournalRootPanelProps>) {
  const bodyClassList = document.body.classList
  bodyClassList.add(__style.journal)
  onCleanup(() => {
    bodyClassList.remove(__style.journal, __style.journalFullview)
  })

  return (
    <Root {...stylex.attrs(style.home)}>
      {props.children}
    </Root>
  )
}