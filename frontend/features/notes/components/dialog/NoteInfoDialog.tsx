import { For, Show } from "solid-js"
import { BsCalendar2Date, BsPencilFill } from "solid-icons/bs"
import { A } from "@solidjs/router"
// ...
import __style from "./NoteInfoDialog.module.css"
import { css } from "molcss"
// ...
import { Button, DialogContent, Spacer } from "~/components"
import { type group } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
import { formatDate, goTimeToDate } from "~/utils"
import type { IBaseLazyComponent } from "~/hooks"

const dialog = css`
  min-width: 35rem;
  min-height: 20rem;
  padding: 0 !important;
  position: relative;
`

const dialog__background = css`
  position: absolute;
  top: 0;
  background-size: cover;
  background-position: 50% 50%;
  filter: blur(7px);
  width: 100%;
  height: 100%;
  &::before {
    content: "";
    display: block;
    background-color: #000000a1;
    background: center center no-repeat var(--img-url);
    background-size: cover;
    width: 100%;
    height: 100%;
  }
`

const dialog__content = css`
  position: relative;
  z-index: 1;
  padding-inline: 15px;
  padding-block: 10px;
`

const dialog__infoSection = css`
  margin-top: 15px;
  margin-bottom: 20px;
  user-select: none;
`

const dialog__infoLine = css`
  gap: 10px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
`

const dialog__infoContent = css`
  padding-left: 10px;
`

const dialog__noDesc = css`
  color: var(--subtext0);
`

interface INoteInfoDialogProps extends IBaseLazyComponent, group.NoteGroupData {
  // 
}

export default function NoteInfoDialog(props: INoteInfoDialogProps) {
  const data = [
    { icon$: BsCalendar2Date, name$: "Created", value$: formatDate(goTimeToDate(props.created)) },
    { icon$: BsPencilFill, name$: "Modified", value$: props.modified ? formatDate(goTimeToDate(props.modified)) : props.modified },
  ]

  return (
    <DialogContent
      class={dialog}
      style={`--img-url:url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`}
      id={__style.dialogContent}
    >
      <main class={dialog__content} id={__style.content}>
        <h1>{props.name}</h1>
        <p>
          <Show when={props.description} fallback={
            <span class={dialog__noDesc}>
              <i>No description provided.</i>
            </span>
          }>
            {props.description}
          </Show>
        </p>

        <section class={dialog__infoSection}>
          <label>Info & Stats</label>
          <ul class={dialog__infoContent}>
            <For each={data}>
              {it => {
                if (!it.value$) return

                return (
                  <li class={dialog__infoLine}>
                    <it.icon$ /> <b>{it.name$}</b>: {it.value$}
                  </li>
                )
              }}
            </For>
          </ul>
        </section>

        <Spacer />

        <div class={css`display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px;`}>
          <Button variant$={ButtonVariant.DANGER}>
            Close
          </Button>
          <A href={`/journal/${props.id}`}>
            <Button>Open</Button>
          </A>
        </div>
      </main>

      <Show when={props.icon}>
        <div class={dialog__background} />
      </Show>
    </DialogContent>
  )
}