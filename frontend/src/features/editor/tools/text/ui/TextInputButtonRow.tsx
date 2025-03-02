import { BsPlus, BsTrashFill } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import __style from "./TextInput.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenterY } from "~/components"
// ...
import { useTextDataContext } from "../provider"

interface ITextInputButtonRowProps extends HTMLAttributes<"div"> {
  currentIndex$: number
}

const style = stylex.create({
  buttonRow: {
    marginLeft: 10,
    gap: 5,
    flexShrink: 0
  }
})

export function TextInputButtonRow(props: ITextInputButtonRowProps) {
  const { textsData$, deleteInput$, focusState$, spawnNewTextInput$ } = useTextDataContext()
  const [whatInputIsFocused] = focusState$

  return (
    <FlexCenterY 
      {...stylex.attrs(style.buttonRow)} 
      id={whatInputIsFocused() === props.currentIndex$ ? __style.buttonRowFocused : __style.buttonRow}
    >
      <div onClick={() => spawnNewTextInput$(props.currentIndex$)}>
        <BsPlus />
      </div>
      <Show when={textsData$().length !== 1}>
        <div onClick={() => deleteInput$(props.currentIndex$)}>
          <BsTrashFill />
        </div>
      </Show>
    </FlexCenterY>
  )
}