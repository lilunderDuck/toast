import { ParentProps } from "solid-js"
// ...
import __style from "./Journal.module.css"
import stylex from "@stylexjs/stylex"
// ...
import type { IJournalCategoryData } from "~/api/journal"
import { FlexCenterY } from "~/components"
import { BsCaretRightFill } from "solid-icons/bs"

const style = stylex.create({
  journalCategory: {
    transition: '0.15s ease-out',
    userSelect: 'none',
    // paddingLeft: 4,
    paddingRight: 10,
  },
  nameAndStuff: {
    width: '100%',
    paddingBlock: 5,
    borderRadius: 6,
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
  },
  leftPadding: {
    paddingLeft: 5
  }
})

interface IJournalCategoryProps extends IJournalCategoryData {
  // ...
}

export default function JournalCategory(props: ParentProps<IJournalCategoryProps>) {
  return (
    <section id={__style.journal} {...stylex.attrs(style.journalCategory)}>
      <FlexCenterY {...stylex.attrs(style.nameAndStuff)}>
        <BsCaretRightFill size={10} />
        <span id={__style.name}>
          {props.name}
        </span>
      </FlexCenterY>
      <div {...stylex.attrs(style.leftPadding)}>
        {props.children}
      </div>
    </section>
  )
}