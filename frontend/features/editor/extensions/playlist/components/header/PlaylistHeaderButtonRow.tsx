import { BsPencilFill, BsPlus } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./PlaylistHeader.module.css"
// ...
import { Button, ButtonRow, Tooltip } from "~/components"

const style = stylex.create({
  header__infoButtonRow: {
    margin: "0 !important"
  }
})

export interface IPlaylistHeaderButtonRowProps extends IActionHandler<PlaylistHeaderButtonRowAction> {
}

export function PlaylistHeaderButtonRow(props: IPlaylistHeaderButtonRowProps) {
  return (
    <ButtonRow {...stylex.attrs(style.header__infoButtonRow)} id={__style.header__buttonRow}>
      <Tooltip label$="Add track">
        <Button
          size$={ButtonSize.ICON}
          onClick={() => props.action$(PlaylistHeaderButtonRowAction.ADD_TRACK_ITEM)}
        >
          <BsPlus />
        </Button>
      </Tooltip>
      <Tooltip label$="Edit playlist">
        <Button
          size$={ButtonSize.ICON}
          onClick={() => props.action$(PlaylistHeaderButtonRowAction.EDIT_METADATA)}
        >
          <BsPencilFill />
        </Button>
      </Tooltip>
    </ButtonRow>
  )
}