import { createSignal, For, Show } from "solid-js"
// @ts-ignore - did use this
import { dndzone } from "solid-dnd-directive"
//                      ^^^^^^^^^^^^^^^^^^^^^
// phew, I can finally live in peace with this one, instead of writting my freaking own
// drag and drop.
// ...
import { AnyVirTreeNode, isFolder, VirFileTree } from "~/api/journal"
// ...
import { useJournalContext } from "../../../context"
import JournalCategory from "./JournalCategory"
import Journal from "./Journal"

export function FileDisplay() {
  const { fileDisplay$, journal$ } = useJournalContext()
  const ROOT_ID = 0
  const getCache = () => fileDisplay$.mapping$

  let lastOpenedJournalId = 0

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
    
    return <Journal {...data} onClick={(type, thisJournal) => {
      if (type === 'open') {
        if (lastOpenedJournalId !== thisJournal.id) {
          journal$.open$(thisJournal.id)
          lastOpenedJournalId = thisJournal.id
        }
      }
    }} />
  }

  // OooOo, scary name
  const RecursivelyRenderItOut = (thisProps: VirFileTree.FolderNode) => {
    const [items, setItems] = createSignal(thisProps.child)

    type WhatTheHeckIsThisType = any
    const handleDndEvent = (e: WhatTheHeckIsThisType) => {
      const {items: newItems} = e.detail
      setItems(newItems)
      fileDisplay$.replaceTree$(thisProps.id === ROOT_ID ? "root" : thisProps.id, newItems)
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
    <Show when={!fileDisplay$.isUpdating$()}>
      <RecursivelyRenderItOut child={fileDisplay$.treeSignal$()} id={ROOT_ID} />
    </Show>
  )
}