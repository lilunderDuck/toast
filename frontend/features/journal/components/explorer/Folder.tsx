import stylex from "@stylexjs/stylex"
import { BsCaretRightFill } from "solid-icons/bs"
import type { ParentProps } from "solid-js"

const style = stylex.create({
  folder: {
    fontSize: 15,
    cursor: "pointer"
  },
  folder__nameWrap: {
    paddingRight: 7,
    paddingBlock: 2,
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  folder__name: {
    overflowX: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  folder__content: {
    marginLeft: 7,
    borderLeft: "2px solid var(--gray6)"
  }
})

interface IFolderProps {
  folderId$: string
  name$: string
  onClick?: HTMLAttributes<"div">["onClick"]
}

export function Folder(props: ParentProps<IFolderProps>) {
  return (
    <section {...stylex.attrs(style.folder)}>
      <div {...stylex.attrs(style.folder__nameWrap)} onClick={props.onClick}>
        <BsCaretRightFill size={14} />
        <span {...stylex.attrs(style.folder__name)}>
          {props.name$}
        </span>
      </div>
      <div {...stylex.attrs(style.folder__content)}>
        {props.children}
      </div>
    </section>
  )
}