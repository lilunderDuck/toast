import stylex from "@stylexjs/stylex"
import { BsPencilFill, BsTrashFill } from "solid-icons/bs"
import { Button, ButtonSizeVariant, ButtonVariant, Flex, FlexCenterY, Spacer } from "client/components"
import { useTodoDataContext, useTodoSectionContext } from "../provider"
import { ThisEditorGlobal } from "client/features/editor/core"
import { splitProps } from "solid-js"
import { mergeClassname } from "client/utils"

const style = stylex.create({
  buttonRow: {
    width: '100%'
  },
  button: {
    flexShrink: 0,
    gap: 10
  }
})

interface IEditAndDeleteButtonRowProps extends HTMLAttributes<"div"> {
  todoId$: number
}

export function EditAndDeleteButtonRow(props: IEditAndDeleteButtonRowProps) {
  const { deleteTodo$, setSomeTodoToEditMode$ } = useTodoDataContext()
  const { id } = useTodoSectionContext()
  const [, others] = splitProps(props, ["todoId$"])

  return (
    <Flex {...others} class={mergeClassname(stylex.attrs(style.buttonRow), others)}>
      <Spacer />
      <FlexCenterY {...stylex.attrs(style.button)}>
        <Button 
          onClick={() => setSomeTodoToEditMode$(id, props.todoId$, true)} 
          size$={ButtonSizeVariant.icon} 
          // variant$={ButtonVariant.danger}
        >
          <BsPencilFill />
        </Button>

        <Button 
          onClick={() => {
            deleteTodo$(id, props.todoId$)
            ThisEditorGlobal.update$()
          }} 
          size$={ButtonSizeVariant.icon} 
          variant$={ButtonVariant.danger}
        >
          <BsTrashFill />
        </Button>
      </FlexCenterY>
    </Flex>
  )
}