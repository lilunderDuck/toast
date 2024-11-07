import stylex from "@stylexjs/stylex"
import __style from "./StatusBar.module.css"
import { Show } from "solid-js"
// import { ThisEditor } from "../ThisEditor"
import { BsBoxFill, BsQuestionDiamondFill } from "solid-icons/bs"
// ...
import TagWithIcon from "./TagWithIcon"
import { getRandomElement } from "~/common"
import { ThisEditor } from "~/libs/editor"
// ...
import { FlexCenterY } from "~/components"

const style = stylex.create({
  statusBar: {
    backgroundColor: 'var(--gray4)',
    paddingInline: 10,
    fontSize: 13,
    gap: 10,
    userSelect: 'none',
    height: 25,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 6
  }
})

export function StatusBar() {
  const randomText = [
    '*the text just magically disappeared*',
    '[redacted]',
    'I just ate all of the text, so...',
    'Hmmmm',
    '*Quack*'
  ]

  return (
    <FlexCenterY {...stylex.attrs(style.statusBar)} editor-tour-status-bar>
      <Show when={ThisEditor.$charsCount() > 0} fallback={
        <TagWithIcon
          name={<>{getRandomElement(randomText)}, there's nothing here...</>}
          icon={<BsQuestionDiamondFill />} 
          bgColor='var(--red5)'
          color='var(--red9)'
        />
      }>
        <TagWithIcon
          name={<>{ThisEditor.$charsCount()} characters</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
        <TagWithIcon
          name={<>{ThisEditor.$wordsCount()} words</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
      </Show>
    </FlexCenterY>
  )
}