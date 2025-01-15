import { createSignal, For, Show } from "solid-js"
import { setDebugMode, dndzone } from "solid-dnd-directive"
//                                    ^^^^^^^^^^^^^^^^^^^^^
// phew, I can finally live in peace with this one, instead of writting my freaking own
// drag and drop.
// ...
import { type FolderNode, type TreeNode } from "../utils"
import { useJournalContext } from "./JournalContext"

__devMode && setDebugMode(true)

export function FileDisplay() {
  const { $fileDisplay, $journal } = useJournalContext()

  const options = $fileDisplay.options
  const FileComponent = options.componentLookup.file
  const FolderComponent = options.componentLookup.folder

  console.log(
    'Used folder component:', FolderComponent.name, 
    '\nUsed file component:', FileComponent.name
  )

  const isFolder = (it: any): it is FolderNode => typeof it === 'object' && 'child' in it

  /**The reason why this function exist is to make draggable file/folder work.
   * 
   * Draggable item [must have an `id` property](https://github.com/isaacHagoel/solid-dnd-directive?tab=readme-ov-file#usage), so it needs to convert
   * `"<random id>"` to `{ id: "<random id>" }`.
   * 
   * And yeah, weird function name I know, naming thing is hard.
   * @param treeNode 
   * @returns
   */
  const rawToDraggable = (treeNode: TreeNode[]) => treeNode.map(it => typeof it === "string" ? { id: it } : it)

  const RenderFolderAndFileComponent = (props: FolderNode | { id: string }) => {
    console.log('cache', $journal.$cache)
    const data = $journal.$cache.get(props.id)
    if (!data) {
      console.log('cannot get data', props)
      return null
    }

    if (isFolder(props)) return (
      //@ts-ignore - oh come on, it does work you know?
      <FolderComponent {...data} onClick={() => options.onClick?.('folder', props.id, data)}>
        <RecursivelyRenderItOut stuff={props.child} />
      </FolderComponent>
    )
    
    //@ts-ignore - i said it DOES WORK!!!
    return <FileComponent {...data} onClick={() => options.onClick?.('file', props.id, data)} />
  }

  // OooOo, scary name
  const RecursivelyRenderItOut = (thisProps: { stuff: TreeNode[] }) => {
    const [items, setItems] = createSignal(rawToDraggable(thisProps.stuff))

    type WhatTheHeckIsThisType = any
    const handleDndEvent = (e: WhatTheHeckIsThisType) => {
      const {items: newItems} = e.detail
      setItems(newItems)
    }

    return (
      //@ts-ignore - "use:dndzone" is a directive, maybe I should add that type somewhere...
      <div use:dndzone={{items}} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
        {void setItems(rawToDraggable(thisProps.stuff))}
        <For each={items()}>  
          {it => <RenderFolderAndFileComponent {...it} />}
        </For>
      </div>
    )
  }
  
  return (
    <Show when={!$fileDisplay.isUpdating()}>
      <RecursivelyRenderItOut stuff={$fileDisplay.tree()} />
    </Show>
  )
}