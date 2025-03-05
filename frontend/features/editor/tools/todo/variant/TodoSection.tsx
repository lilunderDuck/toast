import { For, Show } from "solid-js"
import { BsCaretDownFill } from "solid-icons/bs"
// ...
import { FlexCenterY } from "~/components"
import { useToggleState } from "~/hook"
// ...
import type { AnyTodoSection, TodoSectionData } from "../TodoBlock"
import { Todo } from "./Todo"
import { useEditorContext } from "../../../provider"
import { 
  TodoSectionProvider, 
  TodoSectionButtonRow, 
  TodoSectionInputs, 
  TodoSectionNameInput 
} from "../ui"

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

  const getName = (isUncategorizedSection: boolean) => 
    isUncategorizedSection ? data$().title : (props as TodoSectionData).name
  // ...

  const updateName = (isUncategorizedSection: boolean, newName: string) => {
    if (isUncategorizedSection) {
      return updateTitle$(newName)
    }

    updateSection$(props.id, {
      name: newName
    })
  }

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
          <TodoSectionNameInput 
            getName$={getName}
            onInput$={updateName}
            readonly$={{
              todoSectionComponent$(props) {
                return props.name$
              },
              uncategorizedSectionComponent$(props) {
                return props.name$
              },
            }}
          />
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