import { BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import type { IJournalData } from "~/api/journal"
import { FlexCenterY, Flex, Spacer } from "~/components"

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
  onClick?: (type: 'open' | 'remove', data: IJournalData) => void
}

export default function Journal(props: IJournalProps) {
  return (
    <FlexCenterY 
      {...stylex.attrs(style.journal)} 
      id={__style.journal} 
    >
      <Flex {...stylex.attrs(style.nameAndStuff)} onClick={() => props.onClick?.('open', props)}>
        <span id={__style.name}>
          {props.name}
        </span>
        <Spacer />
      </Flex>
      <div id={__style.button} {...stylex.attrs(style.button)} onClick={() => props.onClick?.('remove', props)}>
        <BsX size={15} />
      </div>
    </FlexCenterY>
  )
}