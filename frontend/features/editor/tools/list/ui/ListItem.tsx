import { BsX } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "../ListBlock.module.css"
// ...
import { Text, type TextData } from "../../../common/text"
import { useEditorContext } from "../../../provider"
import { useListDataContext } from "../provider"

const style = stylex.create({
  buttonList: {
    marginBottom: 10
  },
  listItem: {
    gap: 10
  }
})

interface IListItemProps {
  textData$: TextData[]
  currentIndex$: number
}

export function ListItem(props: IListItemProps) {
  const { isReadonly$ } = useEditorContext()
  const { updateItem$, deleteItem$, addItem$ } = useListDataContext()

  const whenSmashingYourKeyboard: EventHandler<"li", "onKeyUp"> = (keyboardEvent) => {
    if (keyboardEvent.key.toLowerCase() !== "enter") return

    addItem$()
  }
  
  return (
    <li class={__style.item} onKeyUp={whenSmashingYourKeyboard}>
      <FlexCenterY {...stylex.attrs(style.listItem)}>
        <Text
          inputData$={{ text: props.textData$ }}
          onChange$={(data) => updateItem$(props.currentIndex$, data)}
          allowNewLine$={false}
        />
        <Show when={!isReadonly$()}>
          <Spacer />
          <Button
            class={__style.deleteButton}
            size$={ButtonSizeVariant.icon}
            onClick={() => deleteItem$(props.currentIndex$)}
          >
            <BsX />
          </Button>
        </Show>
      </FlexCenterY>
    </li>
  )
}