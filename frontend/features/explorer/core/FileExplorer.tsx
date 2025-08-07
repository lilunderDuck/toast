import { createSignal, For, Setter, Show } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./FileExplorer.module.css"
// ...
import { DONT_RENDER, TreeNode, useFileExplorerContext } from "../provider"
import type { IDndConsiderEvent, IDndFinalizeEvent, IDndOptions } from "../utils"

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

interface IFileExplorerProps {
  // 
}

export function FileExplorer(props: IFileExplorerProps) {
  const { tree$, components$, sessionStorage$, getDataMapping$, isUpdating$, onTreeUpdate$ } = useFileExplorerContext()

  const retriveData = (id: number) => getDataMapping$()[id]

  const FolderComponent = (props: { tree$: TreeNode }) => {
    const [isFolderContentShowing, setIsFolderContentShowing] = createSignal(
      sessionStorage$.get$(props.tree$.id) ?? false
    )

    return (
      <components$.Folder$
        {...retriveData(props.tree$.id)}
        id={props.tree$.id}
        onClick={() => {
          setIsFolderContentShowing(prev => !prev)
          sessionStorage$.set$(props.tree$.id, isFolderContentShowing())
        }}
        isCollapsed$={isFolderContentShowing()}
      >
        <RecursiveRender child$={props.tree$.child} folderId$={props.tree$.id} />
      </components$.Folder$>
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
      if (JSON.stringify(tree$.data$ /*old tree*/) === JSON.stringify(newItems)) {
        return // don't update
      }

      // @ts-ignore - it should works fine
      tree$.replace$(props.folderId$, newItems)
      onTreeUpdate$(tree$.data$)
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
                <components$.File$
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
      <Show when={!isUpdating$()}>
        <RecursiveRender child$={tree$.data$} folderId$={0} />
      </Show>
    </div>
  )
}