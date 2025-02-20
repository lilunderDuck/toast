import { JSX, ParentProps } from "solid-js"
// ...
import { Flex } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalHomeRoot.module.css"
import __scrollbarStyle from'~/assets/style/scrollbar.module.css'
// ...
import { JournalHomeProvider } from "../provider"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  homePage: {
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    height: '100%',
    paddingLeft: 20
  }
})

interface IJournalHomeRootProps {
  sidebarComponent$: JSX.Element
}

export function JournalHomeRoot(props: ParentProps<IJournalHomeRootProps>) {
  return (
    <JournalHomeProvider>
      <Flex {...stylex.attrs(style.homePage)}>
        <div class={mergeClassname(
          stylex.attrs(style.content), 
          `${__style.scrollbar} ${__scrollbarStyle.scrollbar} ${__scrollbarStyle.scrollbarVertical}`
        )}>
          {props.children}
        </div>
        {props.sidebarComponent$}
      </Flex>
    </JournalHomeProvider>
  )
}