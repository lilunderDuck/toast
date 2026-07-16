import { css } from "molcss"
import { Accessor, createContext, createSignal, For, ParentProps, Setter, Show, useContext, VoidComponent } from "solid-js"

const dialog__tabSection = css`
  padding-block: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const dialog__tabButton = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  outline: 4px solid transparent;
  &:focus, &:focus-within {
    outline-color: var(--tab-focus-ring-color);
  }
`

const dialog__tabButtonNotCurrent = css`
  color: var(--overlay2);
  background-color: var(--surface0);
  &:hover {
    background-color: var(--surface2);
    color: var(--text);
  }
`

const dialog__tabButtonCurrent = css`
  color: var(--crust);
  background-color: var(--tab-focus-color);
`

interface ITabPageOption {
  name$: string
  Page$: VoidComponent
}

interface ITabContext {
  pages$: ITabPageOption[]
  currentPage$: Accessor<number>
  setCurrentPage$: Setter<number>
}

const Context = createContext<ITabContext>()

interface ITabRootProps {
  pages$: ITabPageOption[]
}

export function Tab(props: ParentProps<ITabRootProps>) {
  const [page, setPage] = createSignal(0)

  return (
    <Context.Provider value={{
      currentPage$: page,
      setCurrentPage$: setPage,
      pages$: props.pages$,
    }}>
      {props.children}
    </Context.Provider>
  )
}

function useTabContext() {
  const context = useContext(Context)
  // make sure to yell whenever weird stuff happens
  console.assert(context !== undefined, "BARF: you must wrap your component inside a <TabRoot />")
  return context!
}

interface ITabProps {
  tabButtonClass$?: string
  tabFocusColor$?: string
  tabFocusRingColor$?: string
}

export function TabHeader(props: ITabProps) {
  const { currentPage$, setCurrentPage$, pages$ } = useTabContext()
  
  return (
    <header class={dialog__tabSection} style={`--tab-focus-color:${props.tabFocusColor$ ?? "var(--sapphire)"};--tab-focus-ring-color:${props.tabFocusRingColor$ ?? "var(--sapphire)"}`}>
      <For each={pages$}>
        {(it, currentIndex) => (
          <button
            class={`${dialog__tabButton} ${currentPage$() == currentIndex() ? dialog__tabButtonCurrent : dialog__tabButtonNotCurrent} ${props.tabButtonClass$ ?? ""}`}
            onClick={() => setCurrentPage$(currentIndex())}
          >
            {it.name$}
          </button>
        )}
      </For>
    </header>
  )
}

export function TabContent() {
  const { currentPage$, pages$ } = useTabContext()

  return (
    <For each={pages$}>
      {(it, index) => (
        <Show when={currentPage$() === index()}>
          <it.Page$ />
        </Show>
      )}
    </For>
  )
}