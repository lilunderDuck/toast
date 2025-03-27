import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import { type IJournalData } from "~/api/journal"
import { FlexCenterY, Flex, Spacer } from "~/components"
import { useJournalContext } from "~/features/journal"
import { A } from "@solidjs/router"

const style = stylex.create({
  journal: {
    transition: '0.15s ease-out',
    userSelect: 'none',
    paddingInline: 10,
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  nameAndStuff: {
    width: '100%',
    paddingBlock: 5,
    borderRadius: 6,
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

export interface IJournalProps extends IJournalData {
  // ...
}

export default function Journal(props: IJournalProps) {
  const { event$, journal$, getCurrentGroup$ } = useJournalContext()
  const currentGroupId = getCurrentGroup$().id

  const onClickTheJournalName = () => {
    const currentlyOpenJournalId = journal$.currentlyOpened$()?.id
    if (currentlyOpenJournalId !== props.id) {
      return event$.emit$('journal__openJournal', props)
    }

    console.log('No need to open', props.id, "...")
  }

  const onClickRemoveButton = () => {
    event$.emit$('journal__deleteJournal', props)
  }

  return (
    <A href={`/journal/${currentGroupId}/${props.id}`}>
      <FlexCenterY
        {...stylex.attrs(style.journal)}
        id={__style.journal}
        data-id={props.id}
      >
        <Flex {...stylex.attrs(style.nameAndStuff)} onClick={onClickTheJournalName}>
          <span id={__style.name}>
            {props.name}
          </span>
          <Spacer />
        </Flex>
        <div id={__style.button} {...stylex.attrs(style.button)} onClick={onClickRemoveButton}>
          <BsX size={15} />
        </div>
      </FlexCenterY>
    </A>
  )
}