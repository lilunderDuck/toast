import { Show } from "solid-js"
// ...
import __style from "./ListBlock.module.css"
// ...
import { DEFAULT_TEXT_DATA, type TextData } from "../../common/text"
import { type IBlockSetting, useEditorContext } from "../../provider"
import { ListHeader, ListItems, ListItem } from "./ui"
import { ListDataProvider } from "./provider"

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
    blockComponent$(props) {
      const { blocks$, isReadonly$ } = useEditorContext()

      return (
        <ListDataProvider 
          dataIn$={props.dataIn$} 
          onChange$={(data) => blocks$.saveBlockData$(props.blockId$, data)}
        >
          <Show when={!isReadonly$()}>
            <ListHeader />
          </Show>
          <ListItems>
            {(textData, index) => <ListItem currentIndex$={index()} textData$={textData} />}
          </ListItems>
        </ListDataProvider>
      )
    }
  }
}