import { createSignal, For } from "solid-js"
import { FolderNode, type TreeNode } from "../../utils"
import { setDebugMode, dndzone } from "solid-dnd-directive"
import { useJournalContext } from "./JournalContext"

__devMode && setDebugMode(true)

interface IFileDisplayProps {
  $onClickFolder: AnyFunction
  $onClickFile: AnyFunction
  $folderProps: Record<string, string>
  $fileProps: Record<string, string>
}

export function FileDisplay(props: Partial<IFileDisplayProps>) {
  const { $fileDisplay, $journal } = useJournalContext()

  const options = $fileDisplay.options
  const FileComponent = options.componentLookup.file
  const FolderComponent = options.componentLookup.folder

  console.log(
    'Used folder component:', FolderComponent.name, 
    '\nUsed file component:', FileComponent.name
  )

  const isFolder = (it: any): it is FolderNode => typeof it === 'object' && 'child' in it
  const rawToDraggable = (treeNode: TreeNode[]) => treeNode.map(it => typeof it === "string" ? { id: it } : it)

  const RecursivelyRenderItOut = (thisProps: { stuff: TreeNode[] }) => {
    const [items, setItems] = createSignal(rawToDraggable(thisProps.stuff))

    type WhatTheHeckIsThisType = any
    const handleDndEvent = (e: WhatTheHeckIsThisType) => {
      const {items: newItems} = e.detail
      setItems(newItems)
    }

    return (
      //@ts-ignore
      <div use:dndzone={{items}} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
        {void setItems(rawToDraggable(thisProps.stuff))}
        <For each={items()}>  
          {it => {
            console.log('cache', $journal.$cache)
            const data = $journal.$cache.get(it.id)
            if (!data) {
              console.log('cannot get data', it)
              return null
            }
    
            if (isFolder(it)) return (
              <FolderComponent {...data} onClick={() => options.onClick?.('folder', it.id, data)}>
                <RecursivelyRenderItOut stuff={it.child} />
              </FolderComponent>
            )
    
            return <FileComponent {...data} onClick={() => options.onClick?.('file', it.id, data)} />
          }}
        </For>
      </div>
    )
  }
  
  return (
    <RecursivelyRenderItOut stuff={$fileDisplay.tree()} />
  )
}