import { For, Show } from "solid-js"
import { BsCalendar2Date, BsPencilFill } from "solid-icons/bs"
import { A } from "@solidjs/router"
// ...
import __style from "./JournalInfoDialog.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonRow, DialogContent, Spacer, type ILazyDialog } from "~/components"
import { journal } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
import { formatDate, goTimeToDate } from "~/utils"

const style = stylex.create({
  dialog: {
    minWidth: "35rem",
    minHeight: "20rem",
    padding: "0 !important",
    position: "relative"
  },
  background: {
    position: "absolute",
    top: 0,
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    filter: "blur(7px)",
    width: "100%",
    height: "100%",
    "::before": {
      content: "",
      display: "block",
      backgroundColor: "#000000a1",
      background: "center center no-repeat var(--img-url)",
      backgroundSize: "cover",
      width: "100%",
      height: "100%",
    }
  },
  content: {
    position: "relative",
    zIndex: 1,
    paddingInline: 15,
    paddingBlock: 10
  },
  infoSection: {
    marginTop: 15,
    marginBottom: 20,
    userSelect: "none"
  },
  infoLine: {
    gap: 10,
    marginBottom: 2,
    display: "flex",
    alignItems: "center"
  },
  infoContent: {
    paddingLeft: 10
  },
  noDesc: {
    color: "var(--gray11)"
  }
})

interface IJournalInfoDialogProps extends ILazyDialog, journal.JournalGroupData {
  // 
}

export default function JournalInfoDialog(props: IJournalInfoDialogProps) {
  const data = [
    { icon$: BsCalendar2Date, name$: "Created", value$: formatDate(goTimeToDate(props.created)) },
    { icon$: BsPencilFill, name$: "Modified", value$: props.modified ? formatDate(goTimeToDate(props.modified)) : props.modified },
  ]

  return (
    <DialogContent
      {...stylex.attrs(style.dialog)}
      style={`--img-url:url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`}
      id={__style.dialogContent}
    >
      <main {...stylex.attrs(style.content)} id={__style.content}>
        <h1>{props.name}</h1>
        <p>
          <Show when={props.description} fallback={
            <span {...stylex.attrs(style.noDesc)}>
              <i>No description provided.</i>
            </span>
          }>
            {props.description}
          </Show>
        </p>

        <section {...stylex.attrs(style.infoSection)}>
          <label>Info & Stats</label>
          <ul {...stylex.attrs(style.infoContent)}>
            <For each={data}>
              {it => {
                if (!it.value$) return

                return (
                  <li {...stylex.attrs(style.infoLine)}>
                    <it.icon$ /> <b>{it.name$}</b>: {it.value$}
                  </li>
                )
              }}
            </For>
          </ul>
        </section>

        <Spacer />

        <ButtonRow>
          <Button size$={ButtonSize.SMALL} variant$={ButtonVariant.DANGER}>
            Close
          </Button>
          <A href={`/journal/${props.id}`}>
            <Button size$={ButtonSize.SMALL}>Open</Button>
          </A>
        </ButtonRow>
      </main>

      <Show when={props.icon}>
        <div {...stylex.attrs(style.background)} />
      </Show>
    </DialogContent>
  )
}