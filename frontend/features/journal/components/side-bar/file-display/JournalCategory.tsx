import { ParentProps, Show } from "solid-js"
// ...
import __style from "./Journal.module.css"
import stylex from "@stylexjs/stylex"
// ...
import type { IJournalCategoryData } from "~/api/journal"
import { FlexCenterY } from "~/components"
import { BsCaretRightFill } from "solid-icons/bs"
import { useToggleState } from "~/hook"

const style = stylex.create({
  journalCategory: {
    transition: '0.15s ease-out',
    userSelect: 'none',
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
  },
  arrow: {
    rotate: "90deg"
  }
})

interface IJournalCategoryProps extends IJournalCategoryData {
  onClick: EventHandler<"div", "onClick">
}

export function JournalCategory(props: ParentProps<IJournalCategoryProps>) {
  const [isShowing, toggleShowing] = useToggleState()

  const clickThisThing: EventHandler<"div", "onClick"> = (mouseEvent) => {
    toggleShowing()
    props.onClick?.(mouseEvent)
  }

  return (
    <section id={__style.journal} {...stylex.attrs(style.journalCategory)}>
      <FlexCenterY {...stylex.attrs(style.nameAndStuff)} onClick={clickThisThing}>
        <BsCaretRightFill 
          {...stylex.attrs(isShowing() ? style.arrow : {})} 
          size={10} 
        />
        <span id={__style.name}>
          {props.name}
        </span>
      </FlexCenterY>
      <Show when={isShowing()}>
        <div {...stylex.attrs(style.leftPadding)}>
          {props.children}
        </div>
      </Show>
    </section>
  )
}