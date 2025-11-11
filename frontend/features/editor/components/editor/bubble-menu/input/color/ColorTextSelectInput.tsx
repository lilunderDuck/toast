import { BsPaletteFill } from "solid-icons/bs"
import { HoverCard, HoverCardContent } from "~/components"
import InputPopupTrigger from "../InputPopupTrigger"

import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
import { useEditorContext } from "~/features/editor"
import ColorTextSelectInputSection from "./ColorTextSelectInputSection"
import type { ChainedCommands } from "@tiptap/core"

const style = stylex.create({
  input__content: {
    width: "26rem",
    display: "flex",
    gap: 10
  }
})

export interface IColorInputSectionItem {
  name$: string
  colors$: EditorTextColor[]
  setColor$(color: string): ChainedCommands
  resetColor$(): ChainedCommands
}

export function ColorTextSelectInput() {
  const { editor$ } = useEditorContext()

  const chainCommand = () => editor$().chain().focus()

  const itemSection: IColorInputSectionItem[] = [
    {
      name$: "Text color",
      colors$: [
        EditorTextColor.RED,
        EditorTextColor.ORANGE,
        EditorTextColor.YELLOW,
        EditorTextColor.GREEN,
        EditorTextColor.GREEN,
        EditorTextColor.TEAL,
        EditorTextColor.PURPLE,
        EditorTextColor.GREY,
        EditorTextColor.RESET,
        EditorTextColor.CUSTOM,
      ],
      setColor$: (color: string) => chainCommand().setColor(color),
      resetColor$: () => chainCommand().unsetColor()
    },
    {
      name$: "Background color",
      colors$: [
        EditorTextColor.HIGHLIGHT_RED,
        EditorTextColor.HIGHLIGHT_ORANGE,
        EditorTextColor.HIGHLIGHT_YELLOW,
        EditorTextColor.HIGHLIGHT_GREEN,
        EditorTextColor.HIGHLIGHT_GREEN,
        EditorTextColor.HIGHLIGHT_TEAL,
        EditorTextColor.HIGHLIGHT_PURPLE,
        EditorTextColor.HIGHLIGHT_GREY,
        EditorTextColor.RESET,
        EditorTextColor.CUSTOM,
      ],
      setColor$: (color: string) => chainCommand().setBackgroundColor(color),
      resetColor$: () => chainCommand().unsetBackgroundColor()
    }
  ]

  return (
    <HoverCard openDelay={10}>
      <InputPopupTrigger
        icon$={BsPaletteFill}
      />
      <HoverCardContent {...stylex.attrs(style.input__content)}>
        <For each={itemSection}>
          {it => <ColorTextSelectInputSection {...it} />}
        </For>
      </HoverCardContent>
    </HoverCard>
  )
}