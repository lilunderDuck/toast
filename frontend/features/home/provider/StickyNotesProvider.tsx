import { createContext, createSignal, onMount, ParentProps, useContext, type Accessor } from "solid-js"
// ...
import { arrayObjects } from "~/utils"
import type { sticky_notes } from "~/wailsjs/go/models"
import { StickyNotes__getAll, StickyNotes__update } from "~/wailsjs/go/sticky_notes/Exports"

interface IStickyNotesContext {
  deleteStickyNote$(id: sticky_notes.StickyNoteData["id"]): Promise<void>
  addStickyNote$(data: sticky_notes.StickyNoteData): Promise<void>
  updateStickyNote$(id: sticky_notes.StickyNoteData["id"], newData: sticky_notes.StickyNoteData): Promise<void>
  data$: Accessor<sticky_notes.StickyNoteData[]>
}

const Context = createContext<IStickyNotesContext>()

export function StickyNotesProvider(props: ParentProps) {
  const [allStickyNotes, setAllStickyNotes] = createSignal<sticky_notes.StickyNoteData[]>([])

  onMount(async() => {
    setAllStickyNotes(await StickyNotes__getAll())
  })

  const deleteStickyNote: IStickyNotesContext["deleteStickyNote$"] = async(stickyNoteId) => {
    const data = setAllStickyNotes(prev => [...arrayObjects(prev).remove$("id", stickyNoteId)])
    StickyNotes__update(data)
  }

  const createStickyNote: IStickyNotesContext["addStickyNote$"] = async(newData) => {
    const data = setAllStickyNotes(prev => [...prev, newData])
    StickyNotes__update(data)
  }

  const updateStickyNote: IStickyNotesContext["updateStickyNote$"] = async(id, newData) => {
    const data = setAllStickyNotes(prev => arrayObjects(prev).replace$(it => it.id === id, newData))
    StickyNotes__update(data)
  }

  return (
    <Context.Provider value={{
      deleteStickyNote$: deleteStickyNote,
      addStickyNote$: createStickyNote,
      updateStickyNote$: updateStickyNote,
      data$: allStickyNotes,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useStickyNotesContext() {
  return useContext(Context)!
}