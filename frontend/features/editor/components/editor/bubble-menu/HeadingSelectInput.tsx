import { RiEditorH1, RiEditorH2, RiEditorH3, RiEditorH4, RiEditorH5, RiEditorH6 } from "solid-icons/ri"
import { For } from "solid-js"
import { BsCaretDownFill, BsFonts } from "solid-icons/bs"
import type { IconTypes } from "solid-icons"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./HeadingSelectInput.module.css"
// ...
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components"
import { useEditorContext } from "~/features/editor"
// ...
import type { IBubbleMenuItem } from "./Menu"

const style = stylex.create({
  input__trigger: {
    paddingInline: 5,
    marginRight: 10,
    display: "flex",
    gap: 15,
    borderRadius: 6,
    alignItems: "center",
    height: "1.575rem",
    color: "var(--gray11)",
    ":hover": {
      backgroundColor: "var(--gray5)",
      color: "var(--gray12)",
    }
  },
  input__itemWrap: {
    display: "flex",
    flexFlow: "column",
    padding: '0 !important'
  },
  input__item: {
    paddingInline: 12,
    paddingBlock: 7,
    outline: 'none',
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "var(--gray11)",
    ":hover": {
      color: "var(--gray12)"
    }
  }
})

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export default function HeadingSelectInput() {
  const { editor$ } = useEditorContext()
  // @ts-ignore - Property 'toggleHeading' does not exist on type 'ChainedCommands' .ts(2339)
  // it still works tho
  const toggleHeading = (level: HeadingLevel) => editor$().chain().toggleHeading({
    level: level
  }).run()

  const createHeadingItem = (headingLevel: HeadingLevel, icon: IconTypes): IBubbleMenuItem => {
    return {
      name$: `Heading ${headingLevel}`,
      icon$: icon,
      command$: () => toggleHeading(headingLevel),
      isActive$: () => editor$().isActive('heading', { level: headingLevel })
    }
  } 

  const items = () => [
    createHeadingItem(1, RiEditorH1),
    createHeadingItem(2, RiEditorH2),
    createHeadingItem(3, RiEditorH3),
    createHeadingItem(4, RiEditorH4),
    createHeadingItem(5, RiEditorH5),
    createHeadingItem(6, RiEditorH6),
  ]

  
  const Trigger = () => {
    return (
      <HoverCardTrigger 
        {...stylex.attrs(style.input__trigger)} 
        id={__style.selectInput}
        as="button" 
      >
        <BsFonts />
        <BsCaretDownFill class={__style.selectInput__icon} />
      </HoverCardTrigger>
    )
  }

  return (
    <HoverCard openDelay={10}>
      <Trigger />
      <HoverCardContent {...stylex.attrs(style.input__itemWrap)}>
        <For each={items()}>
          {it => (
            <button {...stylex.attrs(style.input__item)} onClick={it.command$}>
              <it.icon$ />
              {it.name$}
            </button>
          )}
        </For>
      </HoverCardContent>
    </HoverCard>
  )
}