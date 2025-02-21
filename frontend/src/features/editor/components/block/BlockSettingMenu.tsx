import stylex from "@stylexjs/stylex"
// ...
import { DropdownMenuContent, DropdownMenuItem } from "~/components"
import { useEditorContext } from "../.."

const style = stylex.create({
  menu: {
    width: '12rem'
  }
})

export default function BlockSettingMenu() {
  const { sessionStorage$, blocks$ } = useEditorContext()

  const deleteCurrentBlock = () => {
    const currentBlockId = sessionStorage$.get$('currentBlock')
    blocks$.delete$(currentBlockId)
  }

  return (
    <DropdownMenuContent {...stylex.attrs(style.menu)}>
      <DropdownMenuItem onClick={deleteCurrentBlock}>
        Delete block
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}