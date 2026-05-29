import { BsPlus, BsThreeDots } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { formatSecondsToMMSS } from "~/utils"
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDialog, createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { playlistIconUrl } from "../api"
import { usePlaylistContext } from "../provider"

const style = stylex.create({
  header: {
    width: "100%",
    height: "14rem",
    display: "flex",
    gap: 15,
    paddingTop: 35,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: "var(--mantle)",
    userSelect: "none",
    position: "relative",
    background: "center top no-repeat var(--cover-icon-url)",
    backgroundSize: "cover"
  },
  header__titleWrap: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    background: "linear-gradient(to top, var(--crust) 0%, transparent 100%)",
    paddingInline: 15,
    paddingTop: "2.75rem"
  },
  header__info: {
    fontSize: 14
  },
  header__moreOptionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingRight: 20,
    paddingBottom: 15,
    display: "flex",
    alignItems: "center",
    gap: 5
  }
})

export function PlaylistHeader() {
  const { data$, tracks$, resyncTracksDuration$, addTrack$ } = usePlaylistContext()
  const coverIconUrl = () => data$()?.coverIcon ? 
    playlistIconUrl(data$()!.id, data$()!.coverIcon!) :
    ""
  // ...

  const ImageFullviewDialog = createLazyLoadedDialog(
    () => import("~/components/dialog/ImageFullviewDialogContent"),
    () => ({
      imageSrc$: coverIconUrl()
    })
  )

  const PlaylistAddTrackDialog = createLazyLoadedDialog(
    () => import("../components/dialog/PlaylistAddTrackDialog"),
    () => ({
      onSubmit$(data) {
        addTrack$(data)
      },
    })
  )

  const TableMoreOptionsDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("../components/dropdown/PlaylistHeaderMoreOptionDropdown"),
    () => ({
      action$(type) {
        switch (type) {
          case PlaylistHeaderDropdownAction.RESYNC_DURATION:
            resyncTracksDuration$()
          break;

          case PlaylistHeaderDropdownAction.VIEW_BACKGROUND:
            ImageFullviewDialog.show$()
          break;
        
          default:
            console.warn("case", type, "have not been handled yet.")
            break;
        }
      },
    })
  )

  return (  
    <header {...stylex.attrs(style.header)} style={`--cover-icon-url:url("${coverIconUrl()}")`}>
      <div {...stylex.attrs(style.header__titleWrap)}>
        <h1>{data$()?.name}</h1>
        <span {...stylex.attrs(style.header__info)}>
          {tracks$().length} tracks • Runtime: {formatSecondsToMMSS(data$()?.totalDuration ?? 0)}
        </span>
      </div>
      <div {...stylex.attrs(style.header__moreOptionButton)}>
        <Tooltip label$="Add track">
          <Button 
            size$={ButtonSize.ICON}
            variant$={ButtonVariant.NO_BACKGROUND}
            onClick={PlaylistAddTrackDialog.show$}
          >
            <BsPlus />
          </Button>
        </Tooltip>
        <TableMoreOptionsDropdownMenu.DropdownMenu$>
          <Tooltip label$="More options">
            <Button
              size$={ButtonSize.ICON}
              variant$={ButtonVariant.NO_BACKGROUND}
            >
              <BsThreeDots />
            </Button>
          </Tooltip>
        </TableMoreOptionsDropdownMenu.DropdownMenu$>
      </div>

      <ImageFullviewDialog.Dialog$ />
      <PlaylistAddTrackDialog.Dialog$ />
    </header>
  )
}