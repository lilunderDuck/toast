import { Checkbox } from "~/components"

import stylex from "@stylexjs/stylex"
import type { TaskData } from "../provider"
import "./Task.css"
import { For, Show } from "solid-js"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  task: {
    // 
  },
  task__nameWrap: {
    display: "flex",
    paddingInline: 5,
    alignItems: "center",
    gap: 10
  },
  task__descriptionWrap: {
    paddingLeft: "2.7rem",
    fontSize: 13,
    color: "var(--gray11)"
  },
  task__subTask: {
    marginLeft: 24,
    paddingTop: 5,
    borderLeft: "1px solid transparent",
    ":hover": {
      borderColor: "var(--gray7)"
    }
  }
})

interface ITaskProps extends TaskData {
  parentId$?: string
}

export function Task(props: ITaskProps) {
  return (
    <section 
      class={MERGE_CLASS("task", stylex.attrs(style.task))} 
      data-parent-id={props.parentId$}
      data-completed={props.completed}
    >
      <div {...stylex.attrs(style.task__nameWrap)}>
        <Checkbox checked={props.completed} onChange={value => console.log(value)} />
        <p class="task__name">
          {props.name}
        </p>
      </div>
      <Show when={props.description}>
        <div {...stylex.attrs(style.task__descriptionWrap)}>
          <p class="task__description">
            {props.description}
          </p>
        </div>
      </Show>
      <Show when={props.subTask}>
        <div {...stylex.attrs(style.task__subTask)}>
          <For each={props.subTask!}>
            {it => <Task {...it} parentId$={props.id} />}
          </For>
        </div>
      </Show>
    </section>
  )
}