import { BsCaretDownFill } from "solid-icons/bs"
// ...
import __style from "./InputPopupTrigger.module.css"
// ...
import { HoverCardTrigger } from "~/components"

import stylex from "@stylexjs/stylex"
import type { IconTypes } from "solid-icons"

const style = stylex.create({
  inputTrigger: {
    paddingInline: 5,
    marginRight: 10,
    display: "flex",
    gap: 15,
    borderRadius: 6,
    alignItems: "center",
    height: "1.575rem",
    color: "var(--subtext0)",
    ":hover": {
      backgroundColor: "var(--surface1)",
      color: "var(--text)",
    }
  },
})

interface IInputPopupTriggerProps {
  icon$: IconTypes
}

export default function InputPopupTrigger(props: IInputPopupTriggerProps) {
  return (
    <HoverCardTrigger
      {...stylex.attrs(style.inputTrigger)}
      id={__style.selectInput}
      as="button"
    >
      <props.icon$ />
      <BsCaretDownFill class={__style.selectInput__icon} />
    </HoverCardTrigger>
  )
}