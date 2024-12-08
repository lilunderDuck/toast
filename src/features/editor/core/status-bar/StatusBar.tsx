import { Show } from "solid-js"
import { BsBoxFill, BsQuestionDiamondFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./StatusBar.module.css"
// ...
import TagWithIcon from "./TagWithIcon"
import { useThisEditorContext } from "../ThisEditorProvider"
// ...
import { getRandomElement } from "~/common"
import { FlexCenterY } from "~/components"

const style = stylex.create({
  statusBar: {
    backgroundColor: 'var(--gray4)',
    paddingInline: 10,
    fontSize: 12,
    gap: 10,
    userSelect: 'none',
    height: 25,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 6
  }
})

export function ThisEditorStatusBar() {
  const { $wordsCount, $charsCount } = useThisEditorContext()
  const randomText = [
    '*the text just magically disappeared*',
    '[redacted]',
    'I just ate all of the text, so...',
    'Hmmmm',
    '*Quack*'
  ]

  return (
    <FlexCenterY {...stylex.attrs(style.statusBar)} editor-tour-status-bar>
      <Show when={$charsCount() > 0} fallback={
        <TagWithIcon
          name={<>{getRandomElement(randomText)}, there's nothing here...</>}
          icon={<BsQuestionDiamondFill />} 
          bgColor='var(--red5)'
          color='var(--red9)'
        />
      }>
        <TagWithIcon
          name={<>{$charsCount()} characters</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
        <TagWithIcon
          name={<>{$wordsCount()} words</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
      </Show>
    </FlexCenterY>
  )
}