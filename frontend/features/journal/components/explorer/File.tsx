import { A } from "@solidjs/router"
// ...
import { journal } from "~/wailsjs/go/models"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./File.module.css"
import { mergeClassname } from "~/utils"
import { useEditorContext } from "~/features/editor"
import { GetJournal } from "~/wailsjs/go/journal/GroupExport"
import { useJournalContext } from "../../provider"

const style = stylex.create({
  file: {
    fontSize: 14,
    marginLeft: 12,
    display: "block",
    marginTop: 2,
  },
  file__name: {
    paddingInline: 7,
    paddingBlock: 2,
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    color: "var(--gray11)",
    borderRadius: 6,
    transition: "0.25s ease-out",
    ":hover": {
      backgroundColor: "var(--gray5)",
      color: "var(--gray12)"
    }
  }
})

interface IFileProps {
  groupId$: string
  journalId$: number
  onClick?: HTMLAttributes<"button">["onClick"]
}

export function File(props: IFileProps) {
  const { open$ } = useEditorContext()
  const { getJournal$ } = useJournalContext()

  const fetchJournalContent = () => {
    const journalData = getJournal$(props.journalId$)
  }

  return (
    <div>
      <A
        href={`/journal/${props.groupId$}/${props.journalId$}`}
        class={mergeClassname(stylex.attrs(style.file, style.file__name), __style.file)}
      >
        {props.journalId$}
      </A>
    </div>
  )
}