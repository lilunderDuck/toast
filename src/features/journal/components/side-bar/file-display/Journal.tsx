import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import type { JournalApi } from "~/api/journal"
import { FlexCenterY, Flex, Spacer } from "~/components"

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

export interface IJournalProps extends JournalApi.JournalData {
  $onClick?: (type: 'open' | 'remove', data: JournalApi.JournalData) => void
}

export function Journal(props: IJournalProps) {
  return (
    <FlexCenterY 
      {...stylex.attrs(style.journal)} 
      id={__style.journal} 
    >
      <Flex onClick={() => props.$onClick?.('open', props)}>
        <span>
          {props.name}
        </span>
        <Spacer />
      </Flex>
      <div {...stylex.attrs(style.button)} onClick={() => props.$onClick?.('remove', props)}>
        <BsX size={15} id={__style.button} />
      </div>
    </FlexCenterY>
  )
}