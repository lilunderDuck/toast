import { BiSolidLeaf } from "solid-icons/bi"
import { createSignal, Show, type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./EditorCharacterCount.module.css"
// ...
import { debounce } from "~/utils"
import { SpinningCube } from "~/components"
// ...
import { useEditorContext } from "../provider"

const style = stylex.create({
  counter: {
    display: "flex",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
    right: 0,
    backgroundColor: "var(--gray4)",
    gap: 15,
    paddingInline: 10,
    paddingBlock: 5,
    borderTopLeftRadius: 6,
    fontSize: 12,
    userSelect: "none",
    color: "var(--gray11)"
  },
  counter__readonlyIconIndicator: {
    color: "var(--blue8)"
  },
  counter__autoSaveIndicator: {
    color: "var(--green11)"
  }
})

export function EditorCharacterCount(props: ParentProps) {
  const { charCount$, wordCount$, event$, isAutoSaving$ } = useEditorContext()
  const [bongoCatFrame, setBongoCatFrame] = createSignal<BongoCatAnimationFrame>(BongoCatAnimationFrame.IDLE)

  const resetStateAfter2Seconds = debounce(() => {
    setBongoCatFrame(BongoCatAnimationFrame.IDLE)
  }, 2000)

  event$.on$(EditorEvent.UPDATE_BONGO_CAT_ANIMATION, () => {
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
      <Show when={props.children} fallback={
        <>
          <div {...stylex.attrs(style.counter__autoSaveIndicator)}>
            {isAutoSaving$() ? <SpinningCube cubeSize$={8} /> : <BiSolidLeaf />}
          </div>
          <span>
            {charCount$()} characters
          </span>
          <span>
            {wordCount$()} words
          </span>
        </>
      }>
        {props.children}
      </Show>
    </div>
  )
}