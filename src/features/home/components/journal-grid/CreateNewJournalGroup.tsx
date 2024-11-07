import stylex from "@stylexjs/stylex"
import JournalGridWrap from "./JournalGridWrap"
import { BsPlus } from "solid-icons/bs"
import { createLazyLoadedDialog } from "~/utils"
import { lazy } from "solid-js"

const style = stylex.create({
  createButton: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const CreateJournalGroupModal = lazy(() => import('../modals/CreateJournalGroupModal'))

export function CreateNewJournalGroup() {
  const modal = createLazyLoadedDialog()

  return (
    <>
      <JournalGridWrap onClick={modal.$show} {...stylex.attrs(style.createButton)}>
        <BsPlus size={30} />
      </JournalGridWrap>
      <modal.$Modal>
        <CreateJournalGroupModal $close={modal.$close} />
      </modal.$Modal>
    </>
  )
}