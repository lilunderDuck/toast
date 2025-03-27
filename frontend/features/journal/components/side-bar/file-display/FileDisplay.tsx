import { createSignal, For, Show } from "solid-js"
import { dndzone } from "solid-dnd-directive"
// ...
import { AnyVirTreeNode, FolderNode, isFolder } from "~/features/journal/utils"
// ...
import { useJournalContext } from "../../../context"
import JournalCategory from "./JournalCategory"
import Journal from "./Journal"

interface IDndDragEvent<T extends number | string> extends CustomEvent {
  detail: {
    info: {
      id: T
      source: "pointer"
      trigger: "draggedEntered"
    }
    items: { id: T }[]
  }
  srcElement: Ref<"div">
  type: "consider" | "finalize"
}

export function FileDisplay() {
  const { fileDisplay$ } = useJournalContext()
  const ROOT_ID = 0
  const getCache = () => fileDisplay$.mapping$

  const RenderFolderAndFileComponent = (props: AnyVirTreeNode) => {
    const data = getCache()[props.id]
    if (!data) {
      return void console.warn('cannot get data', props)
    }

    if (isFolder(props)) {
      return (
        <JournalCategory {...data}>
          <RecursivelyRenderItOut {...props} />
        </JournalCategory>
      )
    }

    return <Journal {...data} />
  }

  // OooOo, scary name
  const RecursivelyRenderItOut = (thisProps: FolderNode) => {
    const [items, setItems] = createSignal(thisProps.child)

    const handleDndEvent = (preview: boolean) => (dragEvent: IDndDragEvent<number>) => {
      const { items: newItems } = dragEvent.detail
      setItems(newItems)
      if (!preview) {
        const folderId = ROOT_ID === thisProps.id ? "root" : thisProps.id
        fileDisplay$.replaceTree$(folderId, newItems)
      }
    }

    return (
      <div use:dndzone={{items}} on:consider={handleDndEvent(true)} on:finalize={handleDndEvent(false)}>
        <For each={items()}>
          {it => <RenderFolderAndFileComponent {...it} />}
        </For>
      </div>
    )
  }

  return (
    <Show when={!fileDisplay$.isUpdating$()}>
      <RecursivelyRenderItOut child={fileDisplay$.treeSignal$()} id={ROOT_ID} />
    </Show>
  )
}