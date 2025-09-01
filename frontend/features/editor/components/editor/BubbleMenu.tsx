import { BsBlockquoteLeft, BsSubscript, BsSuperscript, BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline } from "solid-icons/bs"
import { RiEditorH1, RiEditorH2, RiEditorH3, RiEditorH4, RiEditorH5, RiEditorH6 } from "solid-icons/ri"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, Tooltip } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import { useEditorContext } from "../../provider"

const style = stylex.create({
  menu: {
    gap: 5,
    display: "flex",
    flexFlow: "row"
  },
  menu__icon: {
    flexShrink: 0
  }
})

interface IBubbleMenuProps {
  toggleHeading$: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean
  class?: string
  ref?: HTMLAttributes<"div">["ref"]
}

export function BubbleMenu(props: IBubbleMenuProps) {
  const { editor$ } = useEditorContext()

  // Okay, I have to say, if we just write the code like this:
  //    const chainCommand = editor$().chain().focus()
  //    chainCommand.toggleBold().run()
  // It just throw an error in the console:
  //    RangeError: Applying a mismatched transaction
  //    ... stack traces ...
  // Weirdly enough, if we change the code to this below, the code works fine
  //    const chainCommand = () => editor$().chain().focus()
  //    chainCommand().toggleBold().run()
  // What in the hell...
  const chainCommand = () => editor$().chain().focus()
  const menuOptions = [
    { name$: "bold", icon$: BsTypeBold, run$: () => chainCommand().toggleBold().run() },
    { name$: "italic", icon$: BsTypeItalic, run$: () => chainCommand().toggleItalic().run() },
    { name$: "strikethrough", icon$: BsTypeStrikethrough, run$: () => chainCommand().toggleStrike().run() },
    { name$: "blockquote", icon$: BsBlockquoteLeft, run$: () => chainCommand().toggleBlockquote().run() },
    { name$: "heading 1", icon$: RiEditorH1, run$: () => props.toggleHeading$(1) },
    { name$: "heading 2", icon$: RiEditorH2, run$: () => props.toggleHeading$(2) },
    { name$: "heading 3", icon$: RiEditorH3, run$: () => props.toggleHeading$(3) },
    { name$: "heading 4", icon$: RiEditorH4, run$: () => props.toggleHeading$(4) },
    { name$: "heading 5", icon$: RiEditorH5, run$: () => props.toggleHeading$(5) },
    { name$: "heading 6", icon$: RiEditorH6, run$: () => props.toggleHeading$(6) },
    { name$: "subscript", icon$: BsSubscript, run$: () => chainCommand().toggleSubscript().run() },
    { name$: "superscript", icon$: BsSuperscript, run$: () => chainCommand().toggleSuperscript().run() },
    { name$: "underline", icon$: BsTypeUnderline, run$: () => chainCommand().toggleUnderline().run() },
  ]

  return (
    <div class={mergeClassname(stylex.attrs(style.menu), props)} ref={props.ref}>
      <For each={menuOptions}>
        {it => (
          <Tooltip label$={it.name$}>
            <Button size$={ButtonSize.ICON} onClick={it.run$}>
              {/* @ts-ignore */}
              <it.icon$ {...stylex.attrs(style.menu__icon)} />
            </Button>
          </Tooltip>
        )}
      </For>
    </div>
  )
}