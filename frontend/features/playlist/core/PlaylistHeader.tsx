import { BsPlus, BsThreeDots } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { formatSecondsToMMSS } from "~/utils"
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDialog, createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { playlistIconUrl } from "../api"
import { usePlaylistContext } from "../provider"

const header = css`
  width: 100%;
  height: 14rem;
  display: flex;
  gap: 15px;
  background-color: var(--mantle);
  user-select: none;
  position: relative;
  background: center top no-repeat var(--cover-icon-url);
  background-size: cover;
`

const header__titleWrap = css`
  width: 100%;
  position: absolute;
  bottom: 0;
  padding-inline: 15px;
  padding-bottom: 10px;
`

const header__titleWrapHaveBackground = css`
  background: linear-gradient(to top, var(--crust) 0%, transparent 100%);
`

const header__info = css`
  font-size: 14px;
`

const header__moreOptionButton = css`
  position: absolute;
  bottom: 0;
  right: 0;
  padding-right: 20px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
`

export function PlaylistHeader() {
  const { data$, tracks$, addTrack$, resyncTracksDuration$ } = usePlaylistContext()
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
      }
    })
  )

  const TableMoreOptionsDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("../components/dropdown/PlaylistHeaderMoreOptionDropdown"),
    () => ({
      disableViewBackgroundButton$: data$()?.coverIcon == undefined,
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
      }
    })
  )

  return (  
    <header class={header} style={`--cover-icon-url:url("${coverIconUrl()}")`}>
      <div class={`${header__titleWrap} ${data$()?.icon ? header__titleWrapHaveBackground : ""}`}>
        <h1>{data$()?.name}</h1>
        <span class={header__info}>
          {tracks$().length} tracks • Runtime: {formatSecondsToMMSS(data$()?.totalDuration ?? 0)}
        </span>
      </div>
      <div class={header__moreOptionButton}>
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