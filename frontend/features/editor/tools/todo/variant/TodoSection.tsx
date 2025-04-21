import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Todo } from "./Todo"
import { 
  TodoSectionProvider, 
  TodoSectionInputs,
  TodoSectionNameHeader, 
} from "../ui"
import { type TodoSectionData } from "../data"

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

interface ITodoSectionProps extends TodoSectionData {
  // ...
}

export function TodoSection(props: ITodoSectionProps) {
  return (
    <TodoSectionProvider sectionId$={props.id}>
      <section {...stylex.attrs(style.sections)}>
        <TodoSectionNameHeader data$={props}>
          <div>
            <For each={props.todo}>
              {it => <Todo {...it} />}
            </For>
          </div>
        </TodoSectionNameHeader>
        <TodoSectionInputs />
      </section>
    </TodoSectionProvider>
  )
}