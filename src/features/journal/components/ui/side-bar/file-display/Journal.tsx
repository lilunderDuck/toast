import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import type { JournalApi } from "~/api/journal"
import { FlexCenterY, Spacer } from "~/components"
import { useJournalContext } from "~/features/journal"
import { onCleanup } from "solid-js"

const style = stylex.create({
  journal: {
    fontSize: 13,
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    transition: '0.15s ease-out',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  button: {
    flexShrink: 0,
    padding: 0,
    color: 'var(--gray11)',
    cursor: 'pointer',
    ':hover': {
      color: 'var(--gray12)'
    }
  }
})

interface IJournalProps extends JournalApi.JournalData {
  onClick?: EventHandler<"div", "onClick">
}

let lastJournalId: string | undefined
export function Journal(props: IJournalProps) {
  const { $event, $localStorage } = useJournalContext()

  onCleanup(() => {
    lastJournalId = undefined
  })

  const clickOnDeleteButton = () => {
    $event.$emit('journal__deletingJournal', $localStorage.$get('shouldShowDeleteConfirmationModal'), props)
  }

  return (
    <FlexCenterY 
      {...stylex.attrs(style.journal)} 
      id={__style.journal} 
      onClick={() => {
        const thisJournalId = props.id 
        if (thisJournalId === lastJournalId) return
        $event.$emit('journal__clickingJournal', props)
        lastJournalId = thisJournalId
      }}
    >
      <span>
        {props.name}
      </span>
      <Spacer />
      <div {...stylex.attrs(style.button)} onClick={clickOnDeleteButton}>
        <BsX size={15} id={__style.button} />
      </div>
    </FlexCenterY>
  )
}