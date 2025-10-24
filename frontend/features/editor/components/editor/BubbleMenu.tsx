import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, Tooltip } from "~/components"
import { macro_mergeClassnames } from "macro-def"
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
  const { menus$ } = useEditorContext()

  return (
    <div class={macro_mergeClassnames(stylex.attrs(style.menu), props)} ref={props.ref}>
      <For each={menus$.menuOptions$()}>
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