import { createContext, createSignal, ParentProps, useContext, type Accessor } from "solid-js"
import { arrayObjects } from "~/utils"

interface IStickyNotesContext {
  deleteStickyNote$(id: number): Promise<void>
  addStickyNote$(data: {
    title: string
    content: string
    color?: string
    id: number
  }): Promise<void>
  data$: Accessor<{
    title: string
    content: string
    color?: string
    id: number
  }[]>
}

const Context = createContext<IStickyNotesContext>()

interface IStickyNotesProviderProps {
  
}

export function StickyNotesProvider(props: ParentProps) {
  const [allStickyNotes, setAllStickyNotes] = createSignal([
    {
      title: "hello",
      content: "This is a test!",
      color: "#ffffff",
      id: 124
    },
    {
      title: "world",
      content: "Sticky note is used to temporary note something. It's not meant to be used as another way to save your novel or something.",
      id: 259
    }
  ])

  const deleteStickyNote: IStickyNotesContext["deleteStickyNote$"] = async(stickyNoteId) => {
    setAllStickyNotes(prev => [...arrayObjects(prev).remove$("id", stickyNoteId)])
  }

  const createStickyNote: IStickyNotesContext["addStickyNote$"] = async(data) => {
    setAllStickyNotes(prev => [...prev, data])
  }

  return (
    <Context.Provider value={{
      deleteStickyNote$: deleteStickyNote,
      addStickyNote$: createStickyNote,
      data$: allStickyNotes,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useStickyNotesContext() {
  return useContext(Context)!
}