import stylex from "@stylexjs/stylex"
import __style from "./StatusBar.module.css"
import { Show } from "solid-js"
// import { ThisEditor } from "../ThisEditor"
import { BsBoxFill, BsQuestionDiamondFill } from "solid-icons/bs"
// ...
import TagWithIcon from "./TagWithIcon"
import { getRandomElement } from "~/common"
// ...
import { FlexCenterY } from "~/components"
import { useThisEditorContext } from "../ThisEditorProvider"

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

export function ThisEditorStatusBar() {
  const {  } = useThisEditorContext()
  const randomText = [
    '*the text just magically disappeared*',
    '[redacted]',
    'I just ate all of the text, so...',
    'Hmmmm',
    '*Quack*'
  ]

  return (
    <FlexCenterY {...stylex.attrs(style.statusBar)} editor-tour-status-bar>
      <Show when={0 > 0} fallback={
        <TagWithIcon
          name={<>{getRandomElement(randomText)}, there's nothing here...</>}
          icon={<BsQuestionDiamondFill />} 
          bgColor='var(--red5)'
          color='var(--red9)'
        />
      }>
        <TagWithIcon
          name={<>{0} characters</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
        <TagWithIcon
          name={<>{0} words</>}
          icon={<BsBoxFill />} 
          bgColor=' var(--crimson3)'
          color='var(--crimson9)'
        />
      </Show>
    </FlexCenterY>
  )
}