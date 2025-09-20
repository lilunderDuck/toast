import { BsPauseFill, BsPencilFill, BsPlayFill, BsTrashFill } from "solid-icons/bs"
import { macro_mergeClassnames } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./PlaylistTrackItem.module.css"
// ...
import type { editor } from "~/wailsjs/go/models"
import { Button, ButtonRow, createLazyLoadedDialog } from "~/components"
// ...
import { usePlaylistContext } from "../../provider"
import PlaylistTrackIcon from "./PlaylistTrackIcon"
import PlaylistTrackName from "./PlaylistTrackName"
import { formatSecondsToMMSS } from "~/utils"

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
  },
  item__duration: {
    fontSize: 13
  }
})

interface IPlaylistTrackItemProps extends editor.PlaylistItemData {
  index$: number
  onDelete$: () => void
}

export default function PlaylistTrackItem(props: IPlaylistTrackItemProps) {
  const { trackItems$ } = usePlaylistContext()

  const PlaylistEditTrackDialog = createLazyLoadedDialog(
    () => import("../dialog/PlaylistEditTrackDialog"),
    () => ({
      prevData$: props,
      context$: usePlaylistContext(),
      currentTrackIndex$: props.index$
    })
  )

  const isCurrentlyFocused = () => trackItems$.focusedTrack$()?.trackId$ === props.id

  const shouldShowPlayPauseIcon = () => (
    trackItems$.focusedTrack$()?.isPlaying$ &&
    isCurrentlyFocused()
  )

  return (
    <li
      class={macro_mergeClassnames(stylex.attrs(style.item), __style.item, __style.itemHeader)}
      data-playlist-item-focused={isCurrentlyFocused()}
      data-playlist-item-id={props.id}
    >
      <div 
        {...stylex.attrs(style.item__index)} 
        id={__style.item__index}
        onClick={() => trackItems$.togglePlayTrack$(props)}
      >
        <span>{props.index$ + 1}</span>
        {shouldShowPlayPauseIcon() ? <BsPauseFill size={50} /> : <BsPlayFill size={50} />}
      </div>
      <PlaylistTrackIcon icon$={props.icon} />
      <PlaylistTrackName name$={props.name} author$={props.author} />
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