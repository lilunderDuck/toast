import { Dynamic, For } from "solid-js/web"
// ...
import { ListType } from "../provider/data"
import type { Accessor, JSX } from "solid-js"
import { useListDataContext } from "../provider"
import { TextData } from "~/features/editor/common/text"

interface IListItemsProps {
  children(item: TextData[], index: Accessor<number>): JSX.Element
}

export function ListItems(props: IListItemsProps) {
  const { data$ } = useListDataContext()

  return (
    <Dynamic component={data$().type === ListType.ordered ? "ol" : "ul"}>
      <For each={data$().items}>
        {props.children}
      </For>
    </Dynamic>
  )
}