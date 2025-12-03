import { BsPencilFill, BsTrash } from "solid-icons/bs"
import { For } from "solid-js"
import { MERGE_CLASS } from "macro-def"
// ...
import { Button, Tooltip } from "~/components"
// ...
import "../Task.css"
import stylex from "@stylexjs/stylex"
// ...
import { useTaskContext } from "../../provider"

const style = stylex.create({
  buttonRow: {
    position: "absolute",
    right: 0,
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    top: 0
  }
})

export function TaskButtonRow() {
  const { setIsShowingInput$ } = useTaskContext()
  const buttonRow = [
    { icon$: BsPencilFill, name$: "Edit task", click$: () => setIsShowingInput$(true) },
    { icon$: BsTrash, name$: "Delete task" },
  ]

  return (
    <div class={MERGE_CLASS('task__buttonRow', stylex.attrs(style.buttonRow))}>
      <For each={buttonRow}>
        {it => (
          <Tooltip label$={it.name$}>
            <Button 
              variant$={ButtonVariant.NO_BACKGROUND} 
              size$={ButtonSize.ICON}
              onClick={it.click$}
            >
              <it.icon$ />
            </Button>
          </Tooltip>
        )}
      </For>
    </div>
  )
}