import { createSignal, Show } from "solid-js"
import { BsBoxFill, BsQuestionDiamondFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ThisEditorStatusBar.module.css"
import __bongoCat from "~/features/editor/assets/bongocat.module.css"
// ...
import TagWithIcon from "./TagWithIcon"
import { useThisEditorContext } from "../ThisEditorProvider"
// ...
import { getRandomElement } from "~/common"
import { FlexCenterY } from "~/components"
import { debounce } from "~/utils"

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
  const { $wordsCount, $charsCount, $event } = useThisEditorContext()

  const randomText = [
    '*the text just magically disappeared*',
    '[redacted]',
    'I just ate all of the text, so...',
    'Hmmmm',
    '*Quack*'
  ]

  const bongoCatAnimation = {
    stop: 'bc',
    left_paw: 'dc',
    right_paw: 'ba'
  }

  const [typing, setTyping] = createSignal<keyof typeof bongoCatAnimation>('stop')
  const resetAfterOneSecond = debounce(() => setTyping('stop'), 1000)

  $event.$on('editor_onTyping', () => {
    if (typing() === 'left_paw') {
      setTyping('right_paw')
    }
    else {
      setTyping('left_paw')
    }

    resetAfterOneSecond()
  })

  return (
    <FlexCenterY {...stylex.attrs(style.statusBar)} editor-tour-status-bar>
      <div id={__bongoCat.bongoCat}>
        {bongoCatAnimation[typing()]}
      </div>
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