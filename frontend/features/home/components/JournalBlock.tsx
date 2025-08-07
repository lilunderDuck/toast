import { BsPencilFill } from "solid-icons/bs"
// ...
import __style from './JournalBlock.module.css'
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { Button, createLazyLoadedDialog } from "~/components"
import { journal } from "~/wailsjs/go/models"
import { UpdateGroup } from "~/wailsjs/go/journal/GroupExport"
import { ASSETS_SERVER_URL } from "~/api"
// ...

const style = stylex.create({
  block: {
    width: "10rem",
    height: "10rem",
    position: "relative",
  },
  block_defaultBg: {
    backgroundColor: "var(--gray2)"
  },
  editButton: {
    position: "absolute",
    transition: "0.25s ease-out",
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  content: {
    padding: 10
  },
  name: {
    fontSize: 13
  }
})

interface IJournalBlockProps extends journal.JournalGroupData {
  // ...
}

export function JournalBlock(props: IJournalBlockProps) {
  const JournalInfoDialog = createLazyLoadedDialog(
    () => import("./dialogs/JournalInfoDialog"),
    () => props
  )

  const EditJournalDialog = createLazyLoadedDialog(
    () => import("./dialogs/CreateJournalDialog"),
    () => ({
      prevData$: props,
      async onSubmit$(data) {
        await UpdateGroup(props.id, data)
      },
    })
  )

  return (
    <div 
      {...stylex.attrs(
        style.block, 
        props.icon ? shorthands.background_image$ : style.block_defaultBg
      )} 
      id={__style.block}
      data-block
      style={{
        '--img-url': `url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`
      }}
    >
      <Button 
        size$={ButtonSize.icon} 
        {...stylex.attrs(style.editButton)} 
        id={__style.editButton} 
        onClick={EditJournalDialog.show$}
      >
        <BsPencilFill />
      </Button>
      <div 
        {...stylex.attrs(style.content, shorthands.wh_full$, shorthands.flex_flow_colum)}
        onClick={JournalInfoDialog.show$}
      >
        <div {...stylex.attrs(shorthands.spacer$)} />
        <span {...stylex.attrs(style.name)}>
          {props.name}
        </span>
      </div>

      <JournalInfoDialog.Modal$ />
      <EditJournalDialog.Modal$ />
    </div>
  )
}