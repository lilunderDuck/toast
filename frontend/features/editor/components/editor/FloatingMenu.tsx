import { BsArchiveFill, BsBlockquoteLeft, BsCheck2Square, BsImageFill, BsImages, BsInfoCircleFill, BsTable, BsWindowSplit } from "solid-icons/bs"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { macro_mergeClassnames } from "macro-def"
// ...
import { useEditorContext } from "../../provider"
import { TbPlaylist } from "solid-icons/tb"

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
    width: "14rem",
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
  },
  menu__name: {
    fontSize: 15
  }
})

export function FloatingMenu(props: IFloatingMenuProps) {
  const { editor$ } = useEditorContext()
  const chainCommand = () => editor$().chain().focus()
  const floatingMenuOptions = [
    {
      name$: "image", 
      icon$: BsImageFill, 
      run$: () => chainCommand().insertImage$().run() 
    },
    {
      name$: "image split view", 
      icon$: BsImages, 
      run$: () => chainCommand().insertImageSplitView$().run() 
    },
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
      icon$: BsInfoCircleFill, 
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
    {
      name$: "playlist",
      icon$: TbPlaylist,
      run$: () => chainCommand().insertPlaylist$().run()
    }
  ]

  return (
    <div 
      class={macro_mergeClassnames(
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
            <span {...stylex.attrs(style.menu__name)}>
              {it.name$}
            </span>
          </button>
        )}
      </For>
    </div>
  )
}