import stylex from "@stylexjs/stylex"
import { useEditorContext } from "../../provider"
import { createSignal } from "solid-js"
import { debounce } from "~/utils"
import __style from "./CharacterCount.module.css"

const style = stylex.create({
  counter: {
    display: "flex",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
    right: 0,
    backgroundColor: "var(--gray5)",
    gap: 15,
    paddingInline: 10,
    paddingBlock: 5,
    borderTopLeftRadius: 6,
    fontSize: 13,
    userSelect: "none"
  }
})

export function CharacterCount() {
  const { charCount$, wordCount$, event$ } = useEditorContext()
  const [bongoCatFrame, setBongoCatFrame] = createSignal<BongoCatAnimationFrame>(BongoCatAnimationFrame.IDLE)

  const resetStateAfter2Seconds = debounce(() => {
    setBongoCatFrame(BongoCatAnimationFrame.IDLE)
  }, 2000)

  event$.on$("editor__updateBongoCatAnimation$", () => {
    if (bongoCatFrame() === BongoCatAnimationFrame.LEFT_HAND_TAPPED) {
      setBongoCatFrame(BongoCatAnimationFrame.RIGHT_HAND_TAPPED)
    } else {
      setBongoCatFrame(BongoCatAnimationFrame.LEFT_HAND_TAPPED)
    }

    resetStateAfter2Seconds()
  })

  return (
    <div {...stylex.attrs(style.counter)}>
      <div id={__style.bongoCat}>
        {bongoCatFrame()}
      </div>
      <div />
      <span>
        {charCount$()} characters
      </span>
      <span>
        {wordCount$()} words
      </span>
    </div>
  )
}