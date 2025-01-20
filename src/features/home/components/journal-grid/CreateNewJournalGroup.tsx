import stylex from "@stylexjs/stylex"
import JournalGridWrap from "./JournalGridWrap"
import { BsPlus } from "solid-icons/bs"
import { createLazyLoadedDialog } from "~/components"
import { lazy } from "solid-js"

const style = stylex.create({
  createButton: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export function CreateNewJournalGroup() {
  const modal = createLazyLoadedDialog(lazy(() => import('./modals/CreateJournalGroupModal')))

  return (
    <>
      <JournalGridWrap onClick={modal.show$} {...stylex.attrs(style.createButton)}>
        <BsPlus size={30} />
      </JournalGridWrap>
      <modal.$Modal />
    </>
  )
}