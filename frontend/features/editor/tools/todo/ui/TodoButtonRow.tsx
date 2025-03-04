import { BsTrashFill } from "solid-icons/bs";
import { Button, ButtonSizeVariant, ButtonVariant, FlexCenterY } from "~/components";
import { useTodoDataContext } from "../data";
import { useTodoSectionContext } from "./TodoSectionProvider";

interface ITodoButtonRowProps {
  todoId$: number
}

export function TodoButtonRow(props: ITodoButtonRowProps) {
  const { deleteTodo$ } = useTodoDataContext()
  const { sectionId$ } = useTodoSectionContext()

  return (
    <FlexCenterY>
      <Button
        size$={ButtonSizeVariant.icon}
        variant$={ButtonVariant.danger}
        onClick={() => deleteTodo$(sectionId$, props.todoId$)}
      >
        <BsTrashFill />
      </Button>
    </FlexCenterY>
  )
}