import { A } from "@solidjs/router"
import { IconTypes } from "solid-icons"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  thisThing: {
    paddingInline: 10,
    paddingBlock: 15,
    borderRadius: 6
  }
})

interface IJournalOtherPlaceProps {
  icon$: IconTypes
  iconColor$: string
  name$: string
  description$?: string
  href$: string
}

export function JournalOtherPlace(props: IJournalOtherPlaceProps) {
  return (
    <A href={props.href$}>
      <div {...stylex.attrs(style.thisThing)}>
        <h3>{props.name$}</h3>
        <span>{props.description$}</span>
      </div>
    </A>
  )
}