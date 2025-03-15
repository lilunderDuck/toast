import { onCleanup, splitProps } from "solid-js"
import { BsPencilFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalGrid.module.css"
// ...
import { inlineCssVar } from "~/utils"
import type { IJournalGroupData } from "~/api/journal"
import { Button, ButtonSizeVariant, Flex, Spacer, createLazyLoadedDialog } from "~/components"
// ...
import JournalGridWrap from "./JournalGridWrap"

const style = stylex.create({
  grid: {
    padding: 10,
    position: 'relative'
  },
  text: {
    fontSize: 13
  },
  hitbox: {
    width: '100%',
    height: '100%',
    flexDirection: 'column'
  },
  editButton: {
    flexShrink: 0,
    position: 'absolute',
    right: 10
  }
})

interface IJournalGridProps extends IJournalGroupData {
  onClick: EventHandler<"div", "onClick">
}

export function JournalGrid(props: IJournalGridProps) {
  const modal = createLazyLoadedDialog(
    () => import('./modals/EditJournalGroupModal'), 
    () => {
      const [, stuff] = splitProps(props, ["onClick"])
      return stuff
    }
  )
  
  const [styleId, styleDispose] = inlineCssVar(props.icon ? {
    '--journal-grid-background': `url('${props.icon}')`
  } : {})

  onCleanup(styleDispose)

  return (
    <JournalGridWrap 
      id={styleId} 
      {...stylex.attrs(style.grid)}
    >
      <Button 
        onClick={modal.show$}
        id={__style.editButton}
        size$={ButtonSizeVariant.icon} 
        {...stylex.attrs(style.editButton)}
      >
        <BsPencilFill />
      </Button>
      <Flex {...stylex.attrs(style.hitbox)} onClick={props.onClick}>
        <Spacer />
        <span {...stylex.attrs(style.text)}>
          {props.name}
        </span>
      </Flex>
      {/* ... */}
      <modal.Modal$ />
    </JournalGridWrap>
  )
}