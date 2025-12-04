import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import "./CreateTaskSectionButton.css"
// ...
import { Button } from "~/components"
import { useTaskDataContext } from "../../provider"


const style = stylex.create({
  button : {
    width: "100%",
    gap: 10
  },
  button__seperator: {
    width: "100%",
    height: 3,
    backgroundColor: "var(--gray4)",
    borderRadius: 6
  },
  button__text: {
    flexShrink: 0
  }
})

export function CreateTaskSectionButton() {
  const { create$ } = useTaskDataContext()

  return (
    <Button 
      variant$={ButtonVariant.UNSET}
      size$={ButtonSize.UNSET}
      class={MERGE_CLASS('taskSectionButton', stylex.attrs(style.button))}
      onClick={() => create$(TaskType.SECTION, TREE_VIEW_ROOT_NODE_ID, null as never)}
    > 
      <div {...stylex.attrs(style.button__seperator)} />
      <span {...stylex.attrs(style.button__text)}>
        Add section
      </span>
      <div {...stylex.attrs(style.button__seperator)} />
    </Button>
  )
}