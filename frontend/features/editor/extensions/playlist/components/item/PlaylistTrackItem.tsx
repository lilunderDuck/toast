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

const style = stylex.create({
  item: {
    paddingInline: 10,
    paddingBlock: 10,
    marginInline: 5,
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
  item__nameWrap: {
    marginLeft: "1rem",
    fontSize: 12,
  },
  item__authorName: {
    fontSize: 14,
  },
  item__runtime: {
    fontSize: 14
  }
})

interface IPlaylistTrackItemProps extends editor.PlaylistItemData {
  index$: number
  onDelete$: () => void
}

export default function PlaylistTrackItem(props: IPlaylistTrackItemProps) {
  const { focusedTrack$, togglePlayTrack$ } = usePlaylistContext()

  const PlaylistEditTrackItemDialog = createLazyLoadedDialog(
    () => import("../dialog/PlaylistEditTrackItemDialog"),
    () => ({
      prevData$: props,
      context$: usePlaylistContext(),
      currentTrackIndex$: props.index$
    })
  )

  const isCurrentlyFocused = () => focusedTrack$()?.trackId$ === props.id

  const shouldShowPlayPauseIcon = () => (
    focusedTrack$()?.isPlaying$ &&
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
        onClick={() => togglePlayTrack$(props)}
      >
        <span>{props.index$ + 1}</span>
        {shouldShowPlayPauseIcon() ? <BsPauseFill size={50} /> : <BsPlayFill size={50} />}
      </div>
      <PlaylistTrackIcon icon$={props.icon} />
      <div {...stylex.attrs(style.item__nameWrap)}>
        <h3 class={__style.item__textPrimary}>
          {props.name}
        </h3>
        <span class={macro_mergeClassnames(
          stylex.attrs(style.item__authorName),
          __style.item__textSecondary
        )}>
          {props.author}
        </span>
      </div>
      <span class={macro_mergeClassnames(
        stylex.attrs(style.item__runtime),
        __style.item__textPrimary
      )}>
        00:05
      </span>
      <ButtonRow class={__style.item__buttonRow}>
        <Button 
          size$={ButtonSize.ICON}
          onClick={PlaylistEditTrackItemDialog.show$}
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

      <PlaylistEditTrackItemDialog.Dialog$ />
    </li>
  )
}