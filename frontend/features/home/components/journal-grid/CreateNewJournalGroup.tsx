import { BsPlus } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createLazyLoadedDialog } from "~/components"
// ...
import JournalGridWrap from "./JournalGridWrap"

const style = stylex.create({
  createButton: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export function CreateNewJournalGroup() {
  const modal = createLazyLoadedDialog(() => import('./modals/CreateJournalGroupModal'))

  return (
    <>
      <JournalGridWrap onClick={modal.show$} {...stylex.attrs(style.createButton)}>
        <BsPlus size={30} />
      </JournalGridWrap>
      <modal.Modal$ />
    </>
  )
}