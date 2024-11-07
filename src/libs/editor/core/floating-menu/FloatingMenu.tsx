import stylex from "@stylexjs/stylex"
import type { ThisEditor } from "../ThisEditor"
// ...
import FloatingMenuItem from "./FloatingMenuItem"
import { BsTabletFill } from "solid-icons/bs"

const style = stylex.create({
  this: {
    marginTop: 32,
    paddingInline: 15,
    paddingBlock: 10
  }
})

interface IFloatingMenuProps extends ThisEditor.Ref {}

export default function FloatingMenu(props: IFloatingMenuProps) {
  const editor = props.$editor
  const chainedCommand = () => editor().chain().focus()
  
  return (
    <div {...stylex.attrs(style.this)} ref={props.ref}>
      <FloatingMenuItem 
        $icon={BsTabletFill}
        $name="Table"
        $onClick={() => chainedCommand().insertTable().run()}
      />
    </div>
  )
}