import { BsPencilFill } from "solid-icons/bs"
import { MERGE_CLASS } from "macro-def"
// ...
import './JournalBlock.css'
import stylex from "@stylexjs/stylex"
// ...
import { Button, Spacer } from "~/components"
import { type group } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { useJournalHomeContext } from "../../provider/JournalHomeProvider"

const style = stylex.create({
  block: {
    width: "100%",
    position: "relative",
    display: "flex",
    paddingInline: 10,
    paddingBlock: 5,
    gap: 10,
    marginBottom: 10,
    outline: "4px solid transparent",
    backgroundColor: "var(--mantle)",
    borderRadius: 6,
    textAlign: "left",
    ":hover": {
      outlineColor: "var(--sapphire)"
    }
  },
  block__icon: {
    width: "5rem",
    height: "5rem",
    flexShrink: 0,
    borderRadius: 6
  },
  block__noIcon: {
    backgroundColor: "var(--base)"
  },
  block__withIcon: {
    background: "center center no-repeat var(--img-url)",
    backgroundSize: "cover"
  },
  block__defaultBg: {
    backgroundColor: "var(--mantle)"
  },
  block__editButton: {
    position: "absolute",
    transition: "0.25s ease-out",
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  block__content: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  block__name: {
  }
})

interface IJournalBlockProps extends group.GroupData {
  // ...
}

export function JournalBlock(props: IJournalBlockProps) {
  const { addGroup$, editGroup$ } = useJournalHomeContext()
  const JournalInfoDialog = createLazyLoadedDialog(
    () => import("../dialog/JournalInfoDialog"),
    () => props
  )

  const EditJournalDialog = createLazyLoadedDialog(
    () => import("../dialog/editing/CreateOrEditJournalDialog"),
    () => ({
      prevData$: props,
      onSubmit$: (data) => addGroup$(data),
      onUpdate$: (data) => editGroup$(data.id, data)
    })
  )

  return (
    <button 
      {...stylex.attrs(style.block)}
      id="block"
      data-block-has-icon={props.icon !== undefined && props.icon !== ""}
      style={{
        '--img-url': `url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`
      }}
    >
      <div 
        {...stylex.attrs(style.block__icon, style.block__noIcon)} 
        id="block__icon" 
      />
      <div 
        {...stylex.attrs(style.block__content)}
        onClick={JournalInfoDialog.show$}
      >
        <h2 {...stylex.attrs(style.block__name)}>
          {props.name}
        </h2>
      </div>

      <Button 
        {...stylex.attrs(style.block__editButton)} 
        size$={ButtonSize.ICON} 
        id="block__editButton" 
        onClick={EditJournalDialog.show$}
      >
        <BsPencilFill />
      </Button>
      {/* ... */}
      <JournalInfoDialog.Dialog$ />
      <EditJournalDialog.Dialog$ />
    </button>
  )
}