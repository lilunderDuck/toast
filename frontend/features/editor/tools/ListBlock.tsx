import { createSignal, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ListBlock.module.css"
// ...
import { arrayObjects } from "~/utils"
import { Button, ButtonSizeVariant, FlexCenterY, Spacer } from "~/components"
// ...
import { DEFAULT_TEXT_DATA, type ITextProviderProps, Text, type TextData } from "../common/text"
import { BlockComponentProps, IBlockSetting, useEditorContext } from "../provider"

const enum ListType {
  ordered,
  unordered
}

interface IListBlockData {
  items: TextData[][]
  type: ListType
}

export function createListBlock(): IBlockSetting<IListBlockData> {
  return {
    displayName$: "List",
    get defaultValue$() {
      return {
        items: [
          [DEFAULT_TEXT_DATA]
        ],
        type: ListType.ordered
      }
    },
    blockComponent$: ListBlock
  }
}

function updateTextData(index: number, data: IListBlockData, newTextData: TextData[]) {
  data.items[index] = newTextData
  return data
}

const style = stylex.create({
  buttonList: {
    marginBottom: 10
  },
  listItem: {
    gap: 10
  }
})

function ListBlock(props: BlockComponentProps<IListBlockData>) {
  const { blocks$, isReadonly$ } = useEditorContext()
  const [data, setData] = createSignal(props.dataIn$)

  const onChange = (index: number): ITextProviderProps["onChange$"] => (textData) => {
    setData(prev => updateTextData(index, prev, textData))
    blocks$.saveBlockData$(props.blockId$, data())
  }

  const addNewItem = () => {
    setData(prev => {
      const items = prev.items

      items.push([DEFAULT_TEXT_DATA])
      return { ...prev, items }
    })
    blocks$.saveBlockData$(props.blockId$, data())
  }

  const deleteItem = (atIndex: number) => {
    setData(prev => {
      const items = arrayObjects(prev.items).removeByIndex$(atIndex)
      return { ...prev, items }
    })
    blocks$.saveBlockData$(props.blockId$, data())
  }

  // uncomfortably deeply nesting components/element
  return (
    <div>
      <Show when={!isReadonly$()}>
        <FlexCenterY {...stylex.attrs(style.buttonList)}>
          <Button size$={ButtonSizeVariant.sm} onClick={addNewItem}>
            Add new item
          </Button>
        </FlexCenterY>
      </Show>
      <Dynamic component={data().type === ListType.ordered ? "ol" : "ul"}>
        <For each={data().items}>
          {(it, listIndex) => (
            <li class={__style.item}>
              <FlexCenterY {...stylex.attrs(style.listItem)}>
                <Text
                  inputData$={{ text: it }}
                  onChange$={onChange(listIndex())}
                  allowNewLine$={false}
                />
                <Show when={!isReadonly$()}>
                  <Spacer />
                  <Button 
                    class={__style.deleteButton} 
                    size$={ButtonSizeVariant.icon} 
                    onClick={() => deleteItem(listIndex())}
                  >
                    <BsX />
                  </Button>
                </Show>
              </FlexCenterY>
            </li>
          )}
        </For>
      </Dynamic>
    </div>
  )
}