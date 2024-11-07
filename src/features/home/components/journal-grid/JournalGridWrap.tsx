import stylex from "@stylexjs/stylex"
import { Flex } from "../../../../components"
import { mergeClassname } from "../../../../utils"
import __style from "../JournalList.module.css"

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