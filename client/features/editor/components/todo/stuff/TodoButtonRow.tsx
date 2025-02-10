import { BsCheck2Square, BsUiChecks } from "solid-icons/bs"
import { Show, splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Tooltip } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import { useTodoSectionContext } from "../provider/TodoSectionProvider"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    flexShrink: 0
  }
})

interface ITodoButtonRowProps extends HTMLAttributes<"div"> {
  showTodoSectionButton$?: boolean
}

export function TodoButtonRow(props: ITodoButtonRowProps) {
  const { isShowingSectionInput$, isShowingTodoInput$ } = useTodoSectionContext()
  const [isShowingTodoInput, setisShowingTodoInput] = isShowingTodoInput$
  const [isShowingSectionInput, setisShowingSectionInput] = isShowingSectionInput$

  const [, divProps] = splitProps(props, ["showTodoSectionButton$"])

  let shouldShowTodoSectionButton = props.showTodoSectionButton$ ?? true

  return (
    <FlexCenterY {...divProps} class={mergeClassname(props, stylex.attrs(style.buttonRow))}>
      <Tooltip label$="Create todo">
        <Button 
          size$={ButtonSizeVariant.icon} 
          onClick={() => {
            setisShowingTodoInput(true)
            setisShowingSectionInput(false)
          }}
          disabled={isShowingTodoInput()}
        >
          <BsCheck2Square />
        </Button>
      </Tooltip>
      <Show when={shouldShowTodoSectionButton}>
        <Tooltip label$="Create section">
          <Button 
            size$={ButtonSizeVariant.icon}
            onClick={() => {
              setisShowingSectionInput(true)
              setisShowingTodoInput(false)
            }}
            disabled={isShowingSectionInput()}
          >
            <BsUiChecks />
          </Button>
        </Tooltip>
      </Show>
    </FlexCenterY>
  )
}