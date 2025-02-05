import { createResource, createSignal, Show } from "solid-js"
// ...
import { ArrayElement } from "client/common"
import { LibaryType, LibaryData } from "client/api/misc"
// ...
import { LibarySearchBox, LibaryUsedList } from "../components"
import { api_getLibariesUsed } from "../utils"

export function LibaryUsedSection() {
  const [libraries] = createResource(api_getLibariesUsed)
  const [libaryList, setLibaryList] = createSignal<LibaryData[]>([])
  const options = [
    "in the client",
    "in the server",
    "to build this app"
  ] as const

  type Options = typeof options

  const mapping = {
    "in the client": LibaryType.frontend,
    "in the server":  LibaryType.backend,
    "to build this app": LibaryType.build,
  }

  const SURELY_THIS_IS_SELF_DOCUMENTED = /editorjs|codemirror|corvu|prism|chart|kobalte|modular-forms|solid|stylex/
  const isUsedInTheClient = (thisThing: LibaryData) => {
    return SURELY_THIS_IS_SELF_DOCUMENTED.test(thisThing.name)
  }

  const filterIfSelect = (value: ArrayElement<Options> | null) => {
    const libList = libraries()!
    if (!value) {
      return setLibaryList(libList)
    }

    switch(mapping[value]) {
      case LibaryType.build:
        setLibaryList([...libList.filter(it => it.type === "devDep")])
      break

      case LibaryType.frontend:
        setLibaryList([...libList.filter(it => it.type === 'dep' && isUsedInTheClient(it))])
      break

      case LibaryType.backend: 
        setLibaryList([...libList.filter(it => it.type === 'dep' && !isUsedInTheClient(it))])
      break

      default:
        console.log("Didn't handle case:", value, 'yet')
      break
    }
  }

  return (
    <section>
      <LibarySearchBox
        title$="Which libraries did this app used..." 
        selectBox$={{
          options$: options as unknown as string[],
          placeholder$: "[insert thing to search here]",
          onSelect$: filterIfSelect
        }}
      />
      <Show when={!libraries.loading}>
        {void setLibaryList(libraries()!)}
        <LibaryUsedList libaries={libaryList()} />
      </Show>
    </section>
  )
}