import { createContext, createSignal, ParentProps, useContext, type Accessor, type Component, type Setter } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { ResizableTextarea } from "~/components"
import { createToggableInput } from "~/hooks"
import type { sticky_notes } from "~/wailsjs/go/models"
// ...
import { useStickyNotesContext } from "../provider/StickyNotesProvider"
import { debounce, wrapFn } from "~/utils"

const block__input = css`
  background-color: var(--surface0);
  color: var(--text);
  width: 100%;
  padding: 0;
  padding-inline: 10px;
  border-radius: 6px;
  outline: 2px solid var(--overlay1);
`

const block__readonlyInput = css`
  width: 100%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const block__contentInput = css`
  font-size: 16px;
  outline: 2px solid var(--overlay1);
`

const block__contentReadonlyInput = css`
  font-size: 16px;
  word-break: break-word;
  white-space: break-spaces;
`

export interface IStickyNoteBlockContext {
  color$: Accessor<string>
  setColor$: Setter<string>
  buttonRowShouldAlwaysShow$: Accessor<boolean>
  setButtonRowShouldAlwaysShow$: Setter<boolean>
  TitleInput$: Component
  ContentInput$: Component
  onDelete$(): any
}

const Context = createContext<IStickyNoteBlockContext>()

interface IStickyNoteBlockProviderProps {
  data$: sticky_notes.StickyNoteData
}

export function StickyNoteBlockProvider(props: ParentProps<IStickyNoteBlockProviderProps>) {
  const { deleteStickyNote$, updateStickyNote$ } = useStickyNotesContext()
  const [color, setColor] = createSignal(props.data$.color)
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
    initialContent$: () => props.data$.title,
    onFinalize$(newContent) {
      updateStickyNote$(props.data$.id, { title: newContent }) 
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
    initialContent$: () => props.data$.content,
    onFinalize$(newContent) {
      updateStickyNote$(props.data$.id, { content: newContent }) 
    }
  })

  const updateColorDebouced = debounce((newColor: string) => {
    updateStickyNote$(props.data$.id, { color: newColor })
  }, 500)

  return (
    <Context.Provider value={{
      color$: color,
      setColor$: wrapFn(setColor, updateColorDebouced),
      buttonRowShouldAlwaysShow$: buttonRowShouldAlwaysShow,
      setButtonRowShouldAlwaysShow$: setButtonRowShouldAlwaysShow,
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

export function useStickyNoteBlockContext() {
  return useContext(Context)!
}