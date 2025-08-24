import { BsArchiveFill, BsBlockquoteLeft, BsCheck2Square, BsTable, BsWindowSplit } from "solid-icons/bs"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { mergeClassname } from "~/utils"
// ...
import { useEditorContext } from "../../provider"

interface IFloatingMenuProps {
  toggleHeading$: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean
  class?: string
  ref?: HTMLAttributes<"div">["ref"]
}

const style = stylex.create({
  menu: {
    paddingInline: 5,
    paddingBlock: 10,
    borderRadius: 6,
    width: "10rem",
    height: "10rem",
    userSelect: "none",
    display: "flex",
    backgroundColor: "var(--gray4)",
    flexFlow: "column",
    gap: 3,
  },
  menu__option: {
    color: "var(--gray11)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    ":hover": {
      backgroundColor: "var(--gray7)",
      color: "var(--gray12)",
    }
  }
})

export function FloatingMenu(props: IFloatingMenuProps) {
  const { editor$ } = useEditorContext()
  const chainCommand = () => editor$().chain().focus()
  const floatingMenuOptions = [
    {
      name$: "table", 
      icon$: BsTable, 
      run$: () => chainCommand().insertTable().run() 
    },
    {
      name$: "gallery", 
      icon$: BsArchiveFill, 
      run$: () => chainCommand().insertGallery$().run() 
    },
    {
      name$: "local embed", 
      icon$: BsWindowSplit, 
      run$: () => chainCommand().insertLocalEmbed$().run() 
    },
    {
      name$: "details", 
      icon$: BsTable, 
      // @ts-ignore
      run$: () => chainCommand().setDetails().run() 
    },
    {
      name$: "todo", 
      icon$: BsCheck2Square, 
      run$: () => chainCommand().toggleTaskList().run() 
    },
    {
      name$: "blockquote", 
      icon$: BsBlockquoteLeft, 
      run$: () => chainCommand().toggleBlockquote().run() 
    },
  ]

  return (
    <div 
      class={mergeClassname(
        stylex.attrs(style.menu),
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar,
        props
      )} 
      ref={props.ref}
    >
      <For each={floatingMenuOptions}>
        {it => (
          <button onClick={it.run$} {...stylex.attrs(style.menu__option)} tabindex={1}>
            <it.icon$ />
            <span>
              {it.name$}
            </span>
          </button>
        )}
      </For>
    </div>
  )
}