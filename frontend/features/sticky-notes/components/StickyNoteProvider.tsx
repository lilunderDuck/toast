import { createContext, createSignal, ParentProps, useContext, type Accessor, type Component, type Setter } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { ResizableTextarea } from "~/components"
import { createToggableInput } from "~/hooks"
import type { sticky_notes } from "~/wailsjs/go/models"
// ...
import { useStickyNotesContext } from "../provider/StickyNotesProvider"

const block__input = css`
  background-color: var(--surface0);
  color: var(--text);
  outline: none;
  width: 100%;
  padding: 0;
  padding-inline: 10px;
  border-radius: 6px;
`

const block__readonlyInput = css`
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const block__contentInput = css`
  font-size: 15px;
`

const block__contentReadonlyInput = css`
  font-size: 15px;
  word-break: break-word;
  white-space: break-spaces;
`

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
          class={block__input}
          {...props}
        />
      ),
      Readonly$: (props) => (
        <span class={block__readonlyInput} onClick={props.onClick}>
          {props.children}
        </span>
      )
    },
    initialContent$() {
      return data().title
    },
    onFinalize$(newContent) {
      updateData({ title: newContent }) 
    }
  })

  const { Input$: ContentInput } = createToggableInput({
    component$: {
      Input$: (props) => (
        // @ts-ignore
        <ResizableTextarea
          class={block__contentInput}
          {...props}
        />
      ),
      Readonly$: (props) => (
        <p class={block__contentReadonlyInput} onClick={props.onClick}>
          {props.children}
        </p>
      )
    },
    initialContent$() {
      return data().content
    },
    onFinalize$(newContent) {
      updateData({ content: newContent }) 
    }
  })

  const updateData: IStickyNoteContext["updateData$"] = (newData) => {
    setData(prev => ({ ...prev, ...newData }))
    // @ts-ignore
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