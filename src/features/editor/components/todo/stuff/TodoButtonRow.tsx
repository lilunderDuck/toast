import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, FlexCenterY } from "~/components"
import { useTodoSectionContext } from "../variant/TodoSectionProvider"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    marginBottom: 10
  }
})

export default function TodoButtonRow() {
  const { isShowingSectionInput$, isShowingTodoInput$ } = useTodoSectionContext()
  const [isShowingTodoInput, setisShowingTodoInput] = isShowingTodoInput$
  const [isShowingSectionInput, setisShowingSectionInput] = isShowingSectionInput$

  return (
    <FlexCenterY {...stylex.attrs(style.buttonRow)}>
      <Button 
        size$={ButtonSizeVariant.sm} 
        onClick={() => setisShowingTodoInput(true)}
        disabled={isShowingTodoInput()}
      >
        Create todo
      </Button>
      <Button 
        size$={ButtonSizeVariant.sm}
        onClick={() => setisShowingSectionInput(true)}
        disabled={isShowingSectionInput()}
      >
        Create section
      </Button>
    </FlexCenterY>
  )
}