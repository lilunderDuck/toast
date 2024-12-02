import { inlineCssVar } from "~/utils"
import JournalGridWrap from "./JournalGridWrap"
import { lazy, onCleanup } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "../JournalList.module.css"
// ...
import type { JournalApi } from "~/api/journal"
import { Button, ButtonSizeVariant, Flex, Spacer, createLazyLoadedDialog } from "~/components"
import { BsPencilFill } from "solid-icons/bs"

interface IJournalGridProps extends JournalApi.GroupData {
  $onClick: EventHandler<"div", "onClick">
}

const style = stylex.create({
  grid: {
    padding: 10
  },
  text: {
    fontSize: 13
  },
  // editButtonWrap: {
  //   position: 'relative',
  //   zIndex: 1
  // },
  editButton: {
    flexShrink: 0
  }
})

const EditJournalGroupModal = lazy(() => import('../modals/EditJournalGroupModal'))

export function JournalGrid(props: IJournalGridProps) {
  const modal = createLazyLoadedDialog()
  const [styleId, styleDispose] = inlineCssVar(props.icon ? {
    '--journal-grid-background': `url('${props.icon}')`
  } : {})

  onCleanup(styleDispose)

  return (
    <JournalGridWrap 
      id={styleId} onClick={props.$onClick} 
      {...stylex.attrs(style.grid)}
    >
      <Flex id={__style['journal-grid-edit-button']}>
        <Spacer />
        <Button 
          onClick={modal.$show}
          $size={ButtonSizeVariant.icon} 
          {...stylex.attrs(style.editButton)}
        >
          <BsPencilFill />
        </Button>
      </Flex>
      <Spacer />
      <span {...stylex.attrs(style.text)}>
        {props.name}
      </span>
      {/* ... */}
      <modal.$Modal>
        <EditJournalGroupModal $close={modal.$close} {...props} />
      </modal.$Modal>
    </JournalGridWrap>
  )
}