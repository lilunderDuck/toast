import stylex from "@stylexjs/stylex"
import __style from "./JournalHomeRoot.module.css"
import { mergeClassname } from "~/utils"
import { Flex } from "~/components"
import { JSX, ParentProps } from "solid-js"

const style = stylex.create({
  $homePage: {
    width: '100%',
    height: '100%',
  },
  $content: {
    width: '100%',
    height: '100%',
    paddingLeft: 20
  }
})

interface IJournalHomeRootProps {
  $sidebarComponent: JSX.Element
}

export function JournalHomeRoot(props: ParentProps<IJournalHomeRootProps>) {
  return (
    <Flex class={mergeClassname(stylex.attrs(style.$homePage))}>
      <div app-scrollbar app-scrollbar-vertical class={mergeClassname(
        stylex.attrs(style.$content), 
        __style.scrollbar
      )}>
        {props.children}
      </div>
      {props.$sidebarComponent}
    </Flex>
  )
}