import { splitProps } from "solid-js"
import { BsPencilFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalGrid.module.css"
// ...
import type { IJournalGroupData } from "~/api/journal"
import { Button, ButtonSizeVariant, Flex, Spacer, createLazyLoadedDialog } from "~/components"
// ...
import JournalGridWrap from "./JournalGridWrap"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  grid: {
    padding: 10,
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 2
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

  const getIcon = () => props.hasIcon ? {
    '--background': `url('http://localhost:8080/dynamic/journals/${props.id}/icon.png')` as const
  } : {}

  return (
    <JournalGridWrap 
      id={__style.journalGrid}
      style={getIcon()}
      class={mergeClassname(props.hasIcon ? __style.journalGrid : "")}
    >
      {/* ::before */}
      <div {...stylex.attrs(style.grid)}>
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
      </div>
      {/* ... */}
      <modal.Modal$ />
    </JournalGridWrap>
  )
}