import { A } from "@solidjs/router"
import { BsStickyFill } from "solid-icons/bs"
// ...
import { MERGE_CLASS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./File.module.css"

const style = stylex.create({
  file: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    paddingInline: 5,
    paddingBlock: 2.5,
    transition: "0.25s ease-out",
    borderRadius: 6,
    outline: "2px solid transparent",
    marginRight: 5
  },
  file__name: {
    fontSize: 14,
    display: "block",
    marginTop: 2,
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    color: "var(--gray11)",
    borderRadius: 6,
  }
})

interface IFileProps {
  groupId$: string
  journalId$: string
  name$: string
  onClick?: HTMLAttributes<"button">["onClick"]
}

export function File(props: IFileProps) {
  return (
    <A 
      class={MERGE_CLASS(stylex.attrs(style.file), __style.file)}
      href={`/journal/${props.groupId$}/${props.journalId$}`}
      data-link-no-color=""
      data-no-focus-highlight=""
    >
      <BsStickyFill data-journal-type="not implemented" class={__style.file__icon} />
      <span {...stylex.attrs(style.file__name)}>
        {props.name$}
      </span>
    </A>
  )
}