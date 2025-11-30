import { createSignal, For, Show } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import { arrayObjects } from "~/utils"
// ...
import {
  useTreeViewContext,
  type BaseTreeAdditionalData,
  type ITreeViewComponent,
  type TreeNodeData
} from "../provider"
import { replaceTree } from "../utils"

interface ITreeViewRendererProps<T extends BaseTreeAdditionalData> extends ITreeViewComponent<T> {
  name$?: string
}

export function TreeViewRenderer<
  T extends BaseTreeAdditionalData
>(props: ITreeViewRendererProps<T>) {
  const { data$, event$, callUpdateEvent$, setIsDragging$ } = useTreeViewContext()
  const retriveData = (id: number) => data$().storage[id] as T

  const RecursiveRender = (rendererProps: { child$: TreeNodeData[], folderId$: number }) => {
    const [items, setItems] = createSignal(rendererProps.child$)

    const considerDrag: EventHandler<"section", "on:consider"> = (e) => {
      // @ts-ignore - it should works fine
      setItems(e.detail.items)
      setIsDragging$(true)
    }

    const update = () => {
      callUpdateEvent$(
        replaceTree(data$().tree!, rendererProps.folderId$, items())
      )
    }

    const saveItems: EventHandler<"section", "on:finalize"> = (dragEvent) => {
      setItems(dragEvent.detail.items as any[])
      update()
      setIsDragging$(false)
    }

    event$.on$(`${TreeViewUpdateType.CREATE_NODE}-${rendererProps.folderId$}`, (nodeData) => {
      setItems(prev => [...prev, nodeData])
      update()
    })

    event$.on$(`${TreeViewUpdateType.REMOVE_NODE}-${rendererProps.folderId$}`, () => {
      setItems(prev => arrayObjects(prev).remove$('id', rendererProps.folderId$))
      update()
    })

    return (
      <section
        use:dndzone={{
          items,
          flipDurationMs: 0,
          type: props.name$,
          dropTargetStyle: {
            outline: "none"
          },
        }}
        on:consider={considerDrag}
        on:finalize={saveItems}
      >
        <For each={items()}>
          {it => (
            // Nasty workaround: somehow when you tries to drag, it just throw out 
            // a lot of error.
            // 
            // console.log-ing the props.data$, I find out that it just returns "undefined",
            // so I wrap everything inside a <Show /> component, and it just works, wtf.
            <>
              <Show when={retriveData(it.id)}>
                <Show when={it.child} fallback={
                  <props.Leaf$ nodeId$={it.id} data$={retriveData(it.id)} />
                }>
                  <props.Parent$ nodeId$={it.id} data$={retriveData(it.id)}>
                    <RecursiveRender child$={it.child!} folderId$={it.id} />
                  </props.Parent$>
                </Show>
              </Show>

              <Show when={it.id === TREE_VIEW_ROOT_NODE_ID}>
                <RecursiveRender child$={it.child!} folderId$={it.id} />
              </Show>
            </>
          )}
        </For>
      </section>
    )
  }

  return (
    <RecursiveRender child$={data$().tree} folderId$={TREE_VIEW_ROOT_NODE_ID} />
  )
}