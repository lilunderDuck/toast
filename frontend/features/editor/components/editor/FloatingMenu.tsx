import { BsBlockquoteLeft, BsCheck2Square, BsTable } from "solid-icons/bs"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
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
    paddingInline: 15,
    paddingBlock: 10,
    borderRadius: 6,
    height: "100%",
    userSelect: "none",
    display: "flex"
  },
  menu__option: {
    color: "var(--gray11)"
  },
  menu__name: {
    display: "flex",
    alignItems: "center",
    gap: 10
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
      icon$: BsTable, 
      run$: () => chainCommand().insertGallery$().run() 
    },
    {
      name$: "local embed", 
      icon$: BsTable, 
      run$: () => chainCommand().insertLocalEmbed$().run() 
    },
    {
      name$: "details", 
      icon$: BsTable, 
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
    <div class={mergeClassname(stylex.attrs(style.menu), props)} ref={props.ref}>
      <For each={floatingMenuOptions}>
        {it => (
          <div onClick={it.run$} {...stylex.attrs(style.menu__option)}>
            <div {...stylex.attrs(style.menu__name)}>
              <it.icon$ />
              <span>
                {it.name$}
              </span>
            </div>
            <p></p>
          </div>
        )}
      </For>
    </div>
  )
}