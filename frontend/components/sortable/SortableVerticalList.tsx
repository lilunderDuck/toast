import { 
  useDragDropContext,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  createSortable,
  closestCenter,
  type DragEventHandler,
} from "@thisbeyond/solid-dnd"
import { createSignal, For, type JSX, type Signal, splitProps } from "solid-js"
import { mergeClassname } from "../../utils"

interface ISortableVerticalItemProps extends HTMLAttributes<"div"> {
  itemName$: string
}

export function SortableVerticalItem(props: ISortableVerticalItemProps) {
  const sortable = createSortable(props.itemName$)
  const [state] = useDragDropContext()!
  const [, itsProps] = splitProps(props, [/* @__KEY__ */"itemName$"])

  return (
    <div
      {...itsProps}
      // @ts-ignore
      use:sortable
      class={mergeClassname(props, "sortable")}
      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!state.active.draggable,
      }}
    >
      {props.children}
    </div>
  )
}

interface ISortableVerticalListProps<This extends string> {
  $itemsSignal: Signal<This[]>
  children?: (id: This) => JSX.Element
}

export function SortableVerticalList<T extends string>(props: ISortableVerticalListProps<T>) {
  const [items, setItems] = props.$itemsSignal
  const [activeItem, setActiveItem] = createSignal<string>()
  const ids = () => items()

  const onDragStart: DragEventHandler = ({ draggable }) => setActiveItem(draggable.id as string)

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    const cannotDragOrDrop = ! (draggable && droppable)

    if (cannotDragOrDrop) return
    const currentItems = ids()
    const fromIndex = currentItems.indexOf(draggable.id as T)
    const toIndex = currentItems.indexOf(droppable.id as T)

    if (fromIndex !== toIndex) {
      const updatedItems = currentItems.slice();
      updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1))
      setItems(updatedItems)
    }
  }

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors />
      <SortableProvider ids={ids()}>
        <For each={items()}>
          {props.children!}
        </For>
      </SortableProvider>
      <DragOverlay>
        <div class="sortable">{activeItem()}</div>
      </DragOverlay>
    </DragDropProvider>
  )
}