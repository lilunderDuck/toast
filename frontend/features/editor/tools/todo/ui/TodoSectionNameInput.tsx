import { type Component, Show } from "solid-js"
// ...
import { useEditorContext } from "~/features/editor"
// ...
import { useTodoSectionContext } from "./TodoSectionProvider"
import { Input } from "~/components"

type ReadonlySectionComponent = Component<{ name$: string }>

export interface ITodoSectionNameInputProps {
  readonly$: {
    uncategorizedSectionComponent$: ReadonlySectionComponent
    todoSectionComponent$: ReadonlySectionComponent
  }
  onInput$(isUncategorizedSection: boolean, newName: string): void
  getName$(isUncategorizedSection: boolean): string
}

export function TodoSectionNameInput(props: ITodoSectionNameInputProps) {
  const { sectionId$ } = useTodoSectionContext()
  const { isReadonly$ } = useEditorContext()
  
  const isUncategorizedSection = () => sectionId$ === -1337
  const getName = () => props.getName$(isUncategorizedSection())

  const callOnInputEvent: EventHandler<"input", "onChange"> = (inputEvent) => {
    props.onInput$(isUncategorizedSection(), inputEvent.currentTarget.value)
  }

  return (
    <Show when={isReadonly$()} fallback={
      <Show when={isUncategorizedSection()} fallback={
        <Input
          value={getName()}
          onInput={callOnInputEvent}
          placeholder="Give this section a name"
          disabled={isReadonly$()}
          autocomplete='off'
        />
      }>
        <Input
          value={getName()}
          onInput={callOnInputEvent}
          placeholder="Name this whole todo here a name"
          disabled={isReadonly$()}
          autocomplete='off'
        />
      </Show>
    }>
      <Show when={isUncategorizedSection()} fallback={
        <props.readonly$.todoSectionComponent$ name$={getName()} />
      }>
        <props.readonly$.uncategorizedSectionComponent$ name$={getName()} />
      </Show>
    </Show>
  )
}