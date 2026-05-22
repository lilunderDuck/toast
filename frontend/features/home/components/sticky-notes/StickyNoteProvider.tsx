import stylex from "@stylexjs/stylex"
import { createContext, createSignal, ParentProps, useContext, type Accessor, type Component, type Setter } from "solid-js"
import { ResizableTextarea } from "~/components"
import { createToggableInput } from "~/hooks"
import { useStickyNotesContext } from "../../provider/StickyNotesProvider"
import type { sticky_notes } from "~/wailsjs/go/models"

const style = stylex.create({
  block__input: {
    backgroundColor: "var(--surface0)",
    color: "var(--text)",
    outline: "none",
    width: "100%",
    padding: 0,
    paddingInline: 10,
    borderRadius: 6,
  },
  block__readonlyInput: {
    width: "100%",
    overflowX: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  block__contentInput: {
    fontSize: 15,
  },
  block__contentReadonlyInput: {
    fontSize: 15,
    wordBreak: "break-word",
    whiteSpace: "break-spaces"
  }
})

export interface IStickyNoteContext {
  color$: Accessor<string>
  setColor$: Setter<string>
  buttonRowShouldAlwaysShow$: Accessor<boolean>
  setButtonRowShouldAlwaysShow$: Setter<boolean>
  data$: Accessor<sticky_notes.StickyNoteData>
  updateData$: (newData: Partial<sticky_notes.StickyNoteData>) => void
  TitleInput$: Component
  ContentInput$: Component
  onDelete$(): any
}

const Context = createContext<IStickyNoteContext>()

interface IStickyNoteProviderProps {
  data$: sticky_notes.StickyNoteData
}

export function StickyNoteProvider(props: ParentProps<IStickyNoteProviderProps>) {
  const { deleteStickyNote$, updateStickyNote$ } = useStickyNotesContext()
  const [color, setColor] = createSignal(props.data$.color)
  const [data, setData] = createSignal<IStickyNoteProviderProps["data$"]>(props.data$)
  const [buttonRowShouldAlwaysShow, setButtonRowShouldAlwaysShow] = createSignal(false)

  const { Input$: TitleInput } = createToggableInput({
    component$: {
      Input$: (props) => (
        <input
          {...stylex.attrs(style.block__input)}
          {...props}
        />
      ),
      Readonly$: (props) => (
        <span {...stylex.attrs(style.block__readonlyInput)} onClick={props.onClick}>
          {props.children}
        </span>
      )
    },
    initialContent$() {
      return data().title
    },
    onDiscard$(originalContent) {
      console.log("discard:", originalContent)
    },
    onFinalize$(newContent) {
      console.log("finalize:", newContent)
      updateData({ title: newContent }) 
    }
  })

  const { Input$: ContentInput } = createToggableInput({
    component$: {
      Input$: (props) => (
        // @ts-ignore
        <ResizableTextarea
          {...stylex.attrs(style.block__contentInput)}
          {...props}
        />
      ),
      Readonly$: (props) => (
        <p {...stylex.attrs(style.block__contentReadonlyInput)} onClick={props.onClick}>
          {props.children}
        </p>
      )
    },
    initialContent$() {
      return data().content
    },
    onDiscard$(originalContent) {
      console.log("discard:", originalContent)
    },
    onFinalize$(newContent) {
      console.log("finalize:", newContent)
      updateData({ content: newContent }) 
    }
  })

  const updateData: IStickyNoteContext["updateData$"] = (newData) => {
    setData(prev => ({ ...prev, ...newData }))
    updateStickyNote$(props.data$.id, newData)
  }

  return (
    <Context.Provider value={{
      color$: color,
      setColor$: setColor,
      buttonRowShouldAlwaysShow$: buttonRowShouldAlwaysShow,
      setButtonRowShouldAlwaysShow$: setButtonRowShouldAlwaysShow,
      data$: data,
      updateData$: updateData,
      TitleInput$: TitleInput,
      ContentInput$: ContentInput,
      onDelete$() {
        deleteStickyNote$(props.data$.id)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useStickyNoteContext() {
  return useContext(Context)!
}