import { BsPencilFill } from "solid-icons/bs"
// ...
import __style from './JournalBlock.module.css'
import stylex from "@stylexjs/stylex"
// ...
import { Button, createLazyLoadedDialog, Spacer } from "~/components"
import { journal } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
// ...
import { useJournalHomeContext } from "../provider"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  block: {
    width: "10rem",
    height: "10rem",
    position: "relative",
  },
  block__withImage: {
    background: "center center no-repeat var(--img-url)",
    backgroundSize: "cover"
  },
  block__defaultBg: {
    backgroundColor: "var(--gray2)"
  },
  block__editButton: {
    position: "absolute",
    transition: "0.25s ease-out",
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  block__content: {
    padding: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  block__name: {
    fontSize: 13
  }
})

interface IJournalBlockProps extends journal.JournalGroupData {
  // ...
}

export function JournalBlock(props: IJournalBlockProps) {
  const { addGroup$, editGroup$ } = useJournalHomeContext()
  const JournalInfoDialog = createLazyLoadedDialog(
    () => import("./dialog/JournalInfoDialog"),
    () => props
  )

  const EditJournalDialog = createLazyLoadedDialog(
    () => import("./dialog/editing/CreateOrEditJournalDialog"),
    () => ({
      prevData$: props,
      onSubmit$: (data) => addGroup$(data),
      onUpdate$: (data) => editGroup$(data.id, data)
    })
  )

  return (
    <div 
      class={macro_mergeClassnames(
        stylex.attrs(style.block),
        (props.icon ? stylex.attrs(style.block__withImage) : stylex.attrs(style.block__defaultBg)).class
      )}
      id={__style.block}
      data-block
      style={{
        '--img-url': `url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`
      }}
    >
      <Button 
        {...stylex.attrs(style.block__editButton)} 
        size$={ButtonSize.ICON} 
        id={__style.editButton} 
        onClick={EditJournalDialog.show$}
      >
        <BsPencilFill />
      </Button>
      <div 
        {...stylex.attrs(style.block__content)}
        onClick={JournalInfoDialog.show$}
      >
        <Spacer />
        <span {...stylex.attrs(style.block__name)}>
          {props.name}
        </span>
      </div>

      <JournalInfoDialog.Dialog$ />
      <EditJournalDialog.Dialog$ />
    </div>
  )
}