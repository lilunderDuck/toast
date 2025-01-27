import stylex from "@stylexjs/stylex"
import { Button, ButtonSizeVariant, FlexCenterY } from "~/components"
import { useTodoSectionContext } from "../provider/TodoSectionProvider"
import { BsCheck2Square, BsUiChecks } from "solid-icons/bs"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  buttonRow: {
    gap: 10
  }
})

interface ITodoButtonRowProps extends HTMLAttributes<"div"> {
  // ...
}

export function TodoButtonRow(props: ITodoButtonRowProps) {
  const { isShowingSectionInput$, isShowingTodoInput$ } = useTodoSectionContext()
  const [isShowingTodoInput, setisShowingTodoInput] = isShowingTodoInput$
  const [isShowingSectionInput, setisShowingSectionInput] = isShowingSectionInput$

  return (
    <FlexCenterY {...props} class={mergeClassname(props, stylex.attrs(style.buttonRow))}>
      <Button 
        size$={ButtonSizeVariant.icon} 
        onClick={() => setisShowingTodoInput(true)}
        disabled={isShowingTodoInput()}
      >
        <BsUiChecks />
      </Button>
      <Button 
        size$={ButtonSizeVariant.icon}
        onClick={() => setisShowingSectionInput(true)}
        disabled={isShowingSectionInput()}
      >
        <BsCheck2Square />
      </Button>
    </FlexCenterY>
  )
}