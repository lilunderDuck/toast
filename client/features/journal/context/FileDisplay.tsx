import { createSignal, For } from "solid-js"
import { setDebugMode, dndzone } from "solid-dnd-directive"
//                                    ^^^^^^^^^^^^^^^^^^^^^
// phew, I can finally live in peace with this one, instead of writting my freaking own
// drag and drop.
// ...

import { useJournalContext } from "./JournalContext"
import { AnyVirTreeNode, isFolder, VirFileTree } from "~/api/journal"

__devMode && setDebugMode(true)

export function FileDisplay() {
  const { $fileDisplay, $journal } = useJournalContext()

  // const options = $fileDisplay.options
  const FileComponent = () => <></>
  const FolderComponent = () => <></>

  // console.log(
  //   'Used folder component:', FolderComponent.name, 
  //   '\nUsed file component:', FileComponent.name
  // )

  const RenderFolderAndFileComponent = (props: AnyVirTreeNode) => {
    console.log('cache', $journal.cache$)
    const data = $journal.cache$.get(props.id)
    if (!data) {
      console.log('cannot get data', props)
      return null
    }

    if (isFolder(props)) return (
      //@ts-ignore - oh come on, it does work you know?
      <FolderComponent {...data} onClick={() => options.onClick?.('folder', props.id, data)}>
        <RecursivelyRenderItOut {...props} />
      </FolderComponent>
    )
    
    //@ts-ignore - i said it DOES WORK!!!
    return <FileComponent {...data} onClick={() => options.onClick?.('file', props.id, data)} />
  }

  // OooOo, scary name
  const RecursivelyRenderItOut = (thisProps: VirFileTree.FolderNode) => {
    const [items, setItems] = createSignal(thisProps.child)

    type WhatTheHeckIsThisType = any
    const handleDndEvent = (e: WhatTheHeckIsThisType) => {
      const {items: newItems} = e.detail
      setItems(newItems)
      $fileDisplay.replaceTree$(thisProps.id, newItems)
    }

    return (
      //@ts-ignore - "use:dndzone" is a directive, maybe I should add that type somewhere...
      <div use:dndzone={{items}} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
        <For each={items()}>  
          {it => <RenderFolderAndFileComponent {...it} />}
        </For>
      </div>
    )
  }
  
  return (
    <RecursivelyRenderItOut child={$fileDisplay.treeSignal$()} id="root" />
  )
}