import { A } from "@solidjs/router"
import { css } from "molcss"
import { BsPaperclip } from "solid-icons/bs"
import { FaSolidStickyNote } from "solid-icons/fa"
import { For } from "solid-js"
import { AppTitleBarDraggable, Button } from "~/components"

const home__root = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  position: fixed;
  top: 0;
  z-index: -1;
`

const home__content = css`
  width: 30rem;
`

const home__subAppButton = css`
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  margin-bottom: 5px;
`

export default function Home() {
  const SUB_APPS = [
    {
      name$: "Writing some note I think?",
      icon$: BsPaperclip,
      route$: "/note"
    },
    {
      name$: "Adding some sticky notes as my reminder",
      icon$: FaSolidStickyNote,
      route$: "/sticky-note"
    }
  ]

  return (
    <>
      <AppTitleBarDraggable />
      <div class={home__root}>
        <div class={home__content}>
          <h2>Where would you like to go next?</h2>
          <For each={SUB_APPS}>
            {it => (
              <A href={it.route$}>
                <Button class={home__subAppButton}>
                  <it.icon$ size={30} />
                  <span>{it.name$}</span>
                </Button>
              </A>
            )}
          </For>
        </div>
      </div>
    </>
  )
}
