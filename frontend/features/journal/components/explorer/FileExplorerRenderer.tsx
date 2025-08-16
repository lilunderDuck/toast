import { createSignal, For, Show } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./FileExplorerRenderer.module.css"
// ...
import { DONT_RENDER, type IDndConsiderEvent, type IDndFinalizeEvent, type IDndOptions, TreeNode, useJournalContext } from "~/features/journal"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      dndzone: IDndOptions
    }

    interface CustomEvents {
      "consider": IDndConsiderEvent
      "finalize": IDndFinalizeEvent
    }
  }
}

const style = stylex.create({
  everything: {
    userSelect: "none"
  },
  folderContent: {
    paddingLeft: 10
  }
})

export function FileExplorerRenderer() {
  const { explorerTree$, sessionStorage$ } = useJournalContext()

  const retriveData = (id: number) => explorerTree$.getDataMapping$()[id]
  const sessionStorageKey = (props: { tree$: TreeNode }) => 
    `explorer.${props.tree$.id}` as const
  // 

  const FolderComponent = (props: { tree$: TreeNode }) => {
    const [isFolderContentShowing, setIsFolderContentShowing] = createSignal(
      sessionStorage$.get$(sessionStorageKey(props)) ?? false
    )

    return (
      <explorerTree$.components$.Folder$
        {...retriveData(props.tree$.id)}
        id={props.tree$.id}
        onClick={() => {
          setIsFolderContentShowing(prev => !prev)
          sessionStorage$.set$(sessionStorageKey(props), isFolderContentShowing())
        }}
        isCollapsed$={isFolderContentShowing()}
      >
        <RecursiveRender 
          child$={props.tree$.child!} 
          folderId$={props.tree$.id} 
        />
      </explorerTree$.components$.Folder$>
    )
  }
  
  const RecursiveRender = (props: { child$: TreeNode[], folderId$: number }) => {
    const [items, setItems] = createSignal(props.child$)
    
    const considerDrag: EventHandler<"section", "on:consider"> = (e) => {
      // @ts-ignore - it should works fine
      setItems(e.detail.items)
    }

    const saveItems: EventHandler<"section", "on:finalize"> = (dragEvent) => {
      const newItems = dragEvent.detail.items
      if (JSON.stringify(explorerTree$.tree$.data$ /*old tree*/) === JSON.stringify(newItems)) {
        return // don't update
      }

      // @ts-ignore - it should works fine
      tree$.replace$(props.folderId$, newItems)
      explorerTree$.onTreeUpdate$(explorerTree$.tree$.data$)
    }

    return (
      <section use:dndzone={{ items, flipDurationMs: 0 }} on:consider={considerDrag} on:finalize={saveItems}>
        <For each={items()}>
          {it => {
            if (it.id === DONT_RENDER) {
              return // nothing
            }

            return (
              <Show when={it.child} fallback={
                <explorerTree$.components$.File$
                  {...retriveData(it.id)}
                  id={it.id}
                />
              }>
                <FolderComponent tree$={it} />
              </Show>
            )
          }}
        </For>
      </section>
    )
  }

  return (
    <div {...stylex.attrs(style.everything)} id={__style.fileExplorer}>
      <Show when={!explorerTree$.isUpdating$()}>
        <RecursiveRender child$={explorerTree$.tree$.data$} folderId$={0} />
      </Show>
    </div>
  )
}