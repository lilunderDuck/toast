import stylex from "@stylexjs/stylex"
import { Flex } from "client/components"
import { mergeClassname } from "client/utils"
import __style from "./JournalGrid.module.css"

const style = stylex.create({
  $journal: {
    width: '10rem',
    height: '10rem',
    flexShrink: 0,
    flexFlow: 'column',
    borderRadius: 6
  }
})

export default function JournalGridWrap(props: HTMLAttributes<"div">) {
  return (
    <Flex
      {...props} 
      id={__style['journal-grid']}
      class={mergeClassname(stylex.attrs(style.$journal), props)}
    />
  )
}