import { For, Show } from "solid-js"
import { BsCaretDownFill } from "solid-icons/bs"
// ...
import { FlexCenterY, Input } from "~/components"
import { useToggleState } from "~/utils"
// ...
import { AnyTodoSection, TodoSectionData } from "../TodoBlock"
import { Todo } from "./Todo"
import { useEditorContext } from "../../../provider"
import { TodoSectionProvider, TodoSectionButtonRow, TodoSectionInputs } from "../ui"

import stylex from "@stylexjs/stylex"
import { useTodoDataContext } from "../data"

const style = stylex.create({
  sections: {
    marginBottom: 10
  },
  sectionName: {
    gap: 10
  },
  icon: {
    flexShrink: 0
  },
  icon_hidden: {
    rotate: '270deg'
  }
})

interface ITodoSectionProps {
  // ...
}

export function TodoSection(props: ITodoSectionProps & AnyTodoSection) {
  const { isReadonly$ } = useEditorContext()
  const { updateSection$, updateTitle$, data$ } = useTodoDataContext()
  const [isTodoToggled, toggleTodo] = useToggleState()

  const updateTitle: EventHandler<"input", "onChange"> = (inputEvent) => {
    updateSection$(props.id, {
      name: inputEvent.currentTarget.value
    })
  }

  const updateThisTodoTitle: EventHandler<"input", "onChange"> = (inputEvent) => {
    updateTitle$(inputEvent.currentTarget.value)
  }

  const isUncategorizedSection = () => props.id === -1337

  return (
    <TodoSectionProvider sectionId$={props.id}>
      <section {...stylex.attrs(style.sections)}>
        <FlexCenterY {...stylex.attrs(style.sectionName)}>
          <div
            onClick={toggleTodo}
            {...stylex.attrs(style.icon, isTodoToggled() ? style.icon_hidden : {})}
          >
            <BsCaretDownFill />
          </div>
          <Show when={isUncategorizedSection()} fallback={
            <Input
              value={(props as TodoSectionData).name}
              onInput={updateTitle}
              placeholder="Give this section a name"
              disabled={isReadonly$()}
              autocomplete='off'
            />
          }>
            <Input
              value={data$().title}
              onInput={updateThisTodoTitle}
              placeholder="Name this whole todo here a name"
              disabled={isReadonly$()}
              autocomplete='off'
            />
          </Show>
          <Show when={!isReadonly$()}>
            <TodoSectionButtonRow />
          </Show>
        </FlexCenterY>
        <Show when={!isTodoToggled()}>
          <div>
            <For each={props.todo}>
              {it => <Todo {...it} />}
            </For>
          </div>
        </Show>
        <TodoSectionInputs />
      </section>
    </TodoSectionProvider>
  )
}