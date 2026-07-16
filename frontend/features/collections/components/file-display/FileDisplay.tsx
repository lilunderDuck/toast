import { css } from "molcss"
import { BsFiletypeJson, BsFiletypeTxt, BsFolder2, BsFolderFill } from "solid-icons/bs"
import { For, Show } from "solid-js"
import { Spacer } from "~/components"

const fileDisplay__root = css`
  padding-block: 10px;
`

const fileDisplay__itemWrap = css`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  &:hover {
    background-color: var(--surface0);
  }

  & .fileDisplay__itemDescription {
    display: none;
  }

  &:hover .fileDisplay__itemDescription {
    display: block;
  }
`

const fileDisplay__description = css`
  color: var(--subtext0);
`

export type FileTree = {
  name$: string
  type$: "file" | "folder"
  description$: string
  fileType$?: "json"
  children$: FileTree[]
}

interface IFileDisplayProps {
  tree$: FileTree[]
}

export function FileDisplay(props: IFileDisplayProps) {
  const FileTreeRenderer = (props: { currentTree$: FileTree[] }) => {
    return (
      <For each={props.currentTree$}>
        {it => {
          if (it.type$ === "file") {
            return (
              <div class={fileDisplay__itemWrap}>
                <FileIcon type$={it.fileType$} />
                <span>{it.name$}</span>
                <Spacer />
                <p class={`${fileDisplay__description} fileDisplay__itemDescription`}>
                  {it.description$}
                </p>
              </div>
            )
          }

          return (
            <section>
              <div class={fileDisplay__itemWrap}>
                <BsFolderFill />
                <span>{it.name$}</span>
                <Spacer />
                <p class={`${fileDisplay__description} fileDisplay__itemDescription`}>
                  {it.description$}
                </p>
              </div>
              <Show when={it.children$.length != 0}>
                <FileTreeRenderer currentTree$={it.children$} />
              </Show>
            </section>
          )
        }}
      </For>
    )
  }

  return (
    <div class={fileDisplay__root}>
      <FileTreeRenderer currentTree$={props.tree$} />
    </div>
  )
}

function FileIcon(props: { type$: FileTree["fileType$"] }) {
  switch (props.type$) {
    case "json": return <BsFiletypeJson />

    default:
      return <BsFiletypeTxt />
  }
}