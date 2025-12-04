import { For, lazy, Show, type ParentProps } from "solid-js"
import { BsCaretDownFill, BsCaretRightFill, BsPlus, BsTrashFill } from "solid-icons/bs"
import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import "./TaskSection.css"
// ...
import { Button, Input, Label, Spacer, Tooltip } from "~/components"
import { createToggableInput, useToggle } from "~/hooks"
import { type TreeViewComponentProps } from "~/features/tree-view"
import { EditorTooltip, useEditorContext } from "~/features/editor"
// ...
import { useTaskDataContext, type TaskSectionData } from "../provider"
import { CreateTaskSectionButton } from "./stuff"

const style = stylex.create({
  section: {
    marginBottom: 5
  },
  section__header: {
    display: "flex",
    alignItems: "center",
    paddingInline: 10,
    gap: 10
  }
})

const TaskInput = lazy(() => import("./stuff/TaskInput"))

interface ITaskSectionProps extends TreeViewComponentProps<TaskSectionData> {
  // define your component props here
}

export function TaskSection(props: ParentProps<ITaskSectionProps>) {
  const { isReadonly$ } = useEditorContext()
  const { 
    update$, 
    currentEditedTask$, 
    setCurrentEditedTask$, 
    create$, 
    deleteSection$ 
  } = useTaskDataContext()

  const { Input$ } = createToggableInput({
    component$: {
      Input$: (props) => (
        <Input
          // @ts-ignore
          onKeyDown={props.onKeyDown}
          value={props.value}
        />
      ),
      Readonly$: (props) => (
        <Label onClick={props.onClick}>
          {props.children}
        </Label>
      )
    },
    label$: () => props.data$.name,
    onFinalize$(newContent) {
      update$<TaskType.SECTION>(props.nodeId$, { name: newContent })
    },
  })

  const [isCollapsing, toggleCollapsing] = useToggle()

  const SECTION_BUTTON_ROW = [
    { 
      label$: "Create task",
      icon$: BsPlus, 
      onClick$: () => setCurrentEditedTask$(props.nodeId$)
    },
    { 
      label$: "Delete section", 
      icon$: BsTrashFill, 
      onClick$: () => deleteSection$(props.nodeId$)
    }
  ]

  return (
    <section class={MERGE_CLASS("taskSection", stylex.attrs(style.section))}>
      <header {...stylex.attrs(style.section__header)}>
        <Button
          variant$={ButtonVariant.NO_BACKGROUND}
          size$={ButtonSize.ICON}
          onClick={toggleCollapsing}
        >
          {isCollapsing() ? <BsCaretRightFill /> : <BsCaretDownFill />}
        </Button>
        <EditorTooltip label$="Click to edit">
          <Input$ />
        </EditorTooltip>
        <Spacer />
        <For each={SECTION_BUTTON_ROW}>
          {it => (
            <Tooltip label$={it.label$}>
              <Button
                variant$={ButtonVariant.NO_BACKGROUND}
                size$={ButtonSize.ICON}
                onClick={it.onClick$}
                class="taskSection__buttonRow"
              >
                <it.icon$ />
              </Button>
            </Tooltip>
          )}
        </For>
      </header>
      <Show when={!isCollapsing()}>
        <div>
          {props.children}
        </div>
      </Show>
      <Show when={currentEditedTask$() === props.nodeId$}>
        <TaskInput 
          hideOnSubmit$={false}
          onSubmit$={(value) => create$(TaskType.TASK, props.nodeId$, value)} 
        />
      </Show>
      <Show when={!isReadonly$()}>
        <CreateTaskSectionButton />
      </Show>
    </section>
  )
}