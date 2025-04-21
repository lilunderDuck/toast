import { ParentProps, Show, createSignal, lazy } from "solid-js"
import { BsCaretDownFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenterY } from "~/components"
import { useToggleState } from "~/hook"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { TodoSectionButtonRow } from "../TodoSectionButtonRow"
import { type TodoSectionData } from "../../data"

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

interface ITodoSectionNameHeaderProps {
  data$: TodoSectionData
}

export function TodoSectionNameHeader(props: ParentProps<ITodoSectionNameHeaderProps>) {
  const { isReadonly$ } = useEditorContext()
  const CreateSectionInput = lazy(() => import('../input/CreateSectionInput'))

  const [isTodoToggled, toggleTodo] = useToggleState(true)
  const [isShowingInput, setIsShowingInput] = createSignal(false)

  const clickOnSectionName = () => {
    setIsShowingInput(true)
  }
  
  return (
    <>
      <Show when={isShowingInput()} fallback={
        <FlexCenterY {...stylex.attrs(style.sectionName)}>
          <div
            onClick={toggleTodo}
            {...stylex.attrs(style.icon, isTodoToggled() ? {} : style.icon_hidden)}
          >
            <BsCaretDownFill />
          </div>
          <FlexCenterY 
            as$="span"
            onClick={isReadonly$() ? undefined : clickOnSectionName}
          >
            {props.data$.name}
          </FlexCenterY>
          <Show when={!isReadonly$()}>
            <TodoSectionButtonRow />
          </Show>
        </FlexCenterY>
      }>
        <CreateSectionInput 
          previousData$={props.data$} 
          onCancel$={() => setIsShowingInput(false)}
          onComplete$={() => setIsShowingInput(false)}
        />
      </Show>
      <Show when={isTodoToggled()}>
        {props.children}
      </Show>
    </>
  )
}