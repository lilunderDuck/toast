import { A, type RouteSectionProps } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import { For, Show } from "solid-js"
// ...
import { AppTitleBarDraggable, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuItemIcon, DropdownMenuTrigger } from "~/components"
import { RiEditorRoundedCorner } from "solid-icons/ri"


const style = stylex.create({
  home__titleBar: {
    position: "fixed",
    top: 0,
    left: 0
  },
  home__main: {
    width: "100%",
    height: "100%",
    paddingInline: 15,
    paddingBlock: 10
  },
  home__mainSection: {
    display: "flex",
    alignItems: "center"
  },
  home__dropdownMenu: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
})

export default function TestHome(props: RouteSectionProps) {
  const ITEM_OPTIONS = [
    { name$: "Editor", icon$: RiEditorRoundedCorner, href$: "/test/editor" }
  ]

  return (
    <>
      <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)} />
      <main {...stylex.attrs(style.home__main)}>
        <section {...stylex.attrs(style.home__mainSection)}>
          <h1>Testing places for nerdies.</h1>
          <DropdownMenu>
            <DropdownMenuTrigger as="div">
              <Button size$={ButtonSize.SMALL} variant$={ButtonVariant.DEFAULT}>
                Select a test
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <For each={ITEM_OPTIONS}>
                {it => (
                  <DropdownMenuItem>
                    <A href={it.href$} data-link-no-color {...stylex.attrs(style.home__dropdownMenu)}>
                      <DropdownMenuItemIcon>
                        <it.icon$ />
                      </DropdownMenuItemIcon>
                      {it.name$}
                    </A>
                  </DropdownMenuItem>
                )}
              </For>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        {props.children}
      </main>
    </>
  )
}