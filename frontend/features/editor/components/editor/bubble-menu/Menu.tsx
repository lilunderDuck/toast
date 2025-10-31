import { For } from "solid-js"
import { BsSubscript, BsSuperscript, BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "solid-icons/bs"
import type { IconTypes } from "solid-icons"
import { macro_mergeClassnames } from "macro-def"
import type { ChainedCommands } from "@tiptap/core"
// ...
import { Divider } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
import __style from "./Menu.module.css"
// ...
import { useEditorContext } from "../../../provider"
import MenuItemButton from "./MenuItemButton"
import HeadingSelectInput from "./HeadingSelectInput"

const style = stylex.create({
  menu: {
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    userSelect: "none",
    display: "flex",
    backgroundColor: "var(--gray3)",
    gap: 3,
  },
})

export interface IBubbleMenuItem {
  name$: string
  icon$: IconTypes
  command$: () => ChainedCommands
  isActive$: () => boolean
}

interface IBubbleMenuProps {
  class?: string
  ref?: Ref<"div">
}

export function BubbleMenu(props: IBubbleMenuProps) {
  const { editor$ } = useEditorContext()

  const chainCommand = () => editor$().chain().focus()

  const menuOptions = () => [
    { 
      name$: "Bold", 
      icon$: BsTypeBold, 
      command$: () => chainCommand().toggleBold(),
      isActive$: () => editor$().isActive("bold")
    },
    { 
      name$: "Italic", 
      icon$: BsTypeItalic, 
      command$: () => chainCommand().toggleItalic(),
      isActive$: () => editor$().isActive("italic")
    },
    { 
      name$: "Underline", 
      icon$: BsTypeUnderline, 
      command$: () => chainCommand().toggleUnderline(), 
      isActive$: () => editor$().isActive("underline")
    },
    { 
      name$: "Strikethrough", 
      icon$: BsTypeStrikethrough, 
      command$: () => chainCommand().toggleStrike(),
      isActive$: () => editor$().isActive("strikethrough")
    },
    { 
      name$: "Subscript", 
      icon$: BsSubscript, 
      command$: () => chainCommand().toggleSubscript(), 
      isActive$: () => editor$().isActive("subscript")
    },
    { 
      name$: "Superscript", 
      icon$: BsSuperscript, 
      command$: () => chainCommand().toggleSuperscript(), 
      isActive$: () => editor$().isActive("superscript")
    },
  ] as IBubbleMenuItem[]

  return (
    <div
      class={macro_mergeClassnames(
        stylex.attrs(style.menu),
        __style.menu,
        props
      )}
      ref={props.ref}
      // Quick hack: prevent the menu from dispearing when clicking the menu.
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("mouse down prevented")
      }}
    >
      <HeadingSelectInput />
      <Divider />
      <For each={menuOptions()}>
        {it => (
          <MenuItemButton
            icon$={it.icon$}
            name$={it.name$}
            isActive$={it.isActive$()}
            onClick$={() => it.command$().run()}
          />
        )}
      </For>
    </div>
  )
}