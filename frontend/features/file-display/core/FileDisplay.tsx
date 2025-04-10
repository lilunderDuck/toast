import { createSignal, For, Show } from "solid-js"
// @ts-ignore
import { dndzone } from "solid-dnd-directive"
// ...
import { useFileDisplayContext } from "../provider"
import { type AnyTreeNode, FileNodeType, type FolderNode, type IDndDragEvent, isFolder } from "../utils"
import { FileDisplaySkeleton } from "../components"

export function FileDisplay() {
  const { internal$, replaceTree$ } = useFileDisplayContext()
  const ROOT_ID = 0

  const data = (id: number) => {
    return internal$.getDataMapping$()[id]
  }

  const RenderFolderAndFileComponent = (props: AnyTreeNode) => {
    if (!data(props.id)) {
      return void console.warn('cannot get data', props)
    }

    if (isFolder(props)) {
      return (
        <internal$.FolderComponent$ 
          {...data(props.id)} 
          onClick={() => internal$.callOnOpenEvent$(FileNodeType.FOLDER, data(props.id))}
        >
          <RecursivelyRenderItOut {...props} />
        </internal$.FolderComponent$>
      )
    }

    return (
      <internal$.FileComponent$ 
        {...data(props.id)} 
        onClick={() => internal$.callOnOpenEvent$(FileNodeType.FILE, data(props.id))} 
      />
    )
  }

  // OooOo, scary name
  const RecursivelyRenderItOut = (thisProps: FolderNode) => {
    const [items, setItems] = createSignal(thisProps.child)

    const handleDndEvent = (preview: boolean) => (dragEvent: IDndDragEvent<number>) => {
      const { items: newItems } = dragEvent.detail
      setItems(newItems)
      if (!preview) {
        const folderId = ROOT_ID === thisProps.id ? "root" : thisProps.id
        replaceTree$(folderId, newItems)
      }
    }

    return (
      // @ts-ignore
      <div use:dndzone={{items}} on:consider={handleDndEvent(true)} on:finalize={handleDndEvent(false)}>
        <For each={items()}>
          {it => <RenderFolderAndFileComponent {...it} />}
        </For>
      </div>
    )
  }

  return (
    // todo: fix this REALLY inefficient tree update
    <Show when={!internal$.isLoading$()} fallback={<FileDisplaySkeleton />}>
      <Show when={!internal$.isUpdating$()}>
        <RecursivelyRenderItOut child={internal$.tree$()} id={ROOT_ID} />
      </Show>
    </Show>
  )
}