import { BsPencilFill, BsTrashFill } from "solid-icons/bs"
import { macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./PlaylistTrackItem.module.css"
// ...
import type { playlist } from "~/wailsjs/go/models"
import { Button, ButtonRow } from "~/components"
import { formatSecondsToMMSS } from "~/utils"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { usePlaylistContext } from "../../provider"
import { PlaylistTrackIcon, PlaylistTrackName } from "./stuff"

const style = stylex.create({
  item: {
    paddingInline: 15,
    paddingBlock: 10,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    gap: 15,
    outline: "none"
  },
  item__index: {
    width: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  item__duration: {
    fontSize: 13
  }
})

interface IPlaylistTrackItemProps extends playlist.PlaylistItemData {
  index$: number
  onDelete$: () => void
}

export default function PlaylistTrackItem(props: IPlaylistTrackItemProps) {
  const { track$ } = usePlaylistContext()

  const PlaylistEditTrackDialog = createLazyLoadedDialog(
    () => import("../dialog/PlaylistEditTrackDialog"),
    () => ({
      prevData$: props,
      context$: usePlaylistContext(),
      currentTrackIndex$: props.index$
    })
  )

  const isCurrentlyFocused = () => track$.focusedTrack$()?.trackId$ === props.id

  const togglePlayTrack = () => {
    track$.togglePlayTrack$(props.id)
  }

  return (
    <li
      class={macro_mergeClassnames(stylex.attrs(style.item), __style.item, __style.itemHeader)}
      data-playlist-item-focused={isCurrentlyFocused()}
      data-playlist-item-id={props.id}
    >
      <div class={macro_mergeClassnames(stylex.attrs(style.item__index), __style.item__textPrimary)} onClick={togglePlayTrack}>
        <span>{props.index$ + 1}</span>
      </div>
      <PlaylistTrackIcon icon$={props.icon} />
      <PlaylistTrackName 
        name$={props.name} 
        author$={props.author} 
      />
      <span class={macro_mergeClassnames(stylex.attrs(style.item__duration), __style.item__textPrimary)}>
        {formatSecondsToMMSS(props.duration)}
      </span>
      <ButtonRow class={__style.item__buttonRow}>
        <Button 
          size$={ButtonSize.ICON}
          onClick={PlaylistEditTrackDialog.show$}
        >
          <BsPencilFill />
        </Button>
        <Button 
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.DANGER}
          onClick={props.onDelete$}
        >
          <BsTrashFill />
        </Button>
      </ButtonRow>

      <PlaylistEditTrackDialog.Dialog$ />
    </li>
  )
}