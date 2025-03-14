import { lazy, Show } from 'solid-js'
// ...
import { useEditorContext } from '~/features/editor'
// ...
import { useTodoSectionContext } from './TodoSectionProvider'

export function TodoSectionInputs() {
  const { isShowingTodoInput$, isShowingSectionInput$ } = useTodoSectionContext()
  const { isReadonly$ } = useEditorContext()
  
  const CreateTodoInput = lazy(() => import('./input/CreateTodoInput'))
  const CreateSectionInput = lazy(() => import('./input/CreateSectionInput'))

  return (
    <Show when={!isReadonly$()}>
      <Show when={isShowingSectionInput$()}>
        <CreateSectionInput />
      </Show>
      <Show when={isShowingTodoInput$()}>
        <CreateTodoInput />
      </Show>
    </Show>
  )
}