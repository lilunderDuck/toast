import { createResource, For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { GetPackageListData } from "~/wailsjs/go/misc/Exports"
import type { misc } from "~/wailsjs/go/models"
// ...
import LibraryUsedInfoCard from "./LibraryUsedInfoCard"

const style = stylex.create({
  list: {
    userSelect: "none",
    marginTop: 15,
  },
  list__content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr"
  }
})

interface ILibraryUsedListProps {
  // define your component props here
}

export function LibraryUsedList(props: ILibraryUsedListProps) {
  const [libUsed] = createResource<misc.PackageContentData[]>(GetPackageListData)

  return (
    <section {...stylex.attrs(style.list)}>
      <h4>Library used to make this app.</h4>
      <div {...stylex.attrs(style.list__content)}>
        <For each={libUsed() ?? []}>
          {it => <LibraryUsedInfoCard {...it} />}
        </For>
      </div>
    </section>
  )
}