import { BsArrowLeft, BsCaretLeftFill, BsCaretRightFill, BsInfoCircleFill } from "solid-icons/bs"
import { useNavigate } from "@solidjs/router"
import { createEffect, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./GalleryNav.css"
// ...
import { useGalleryContext } from "../provider"
// ...
import { AppTitleBarDraggable, Button, Kbd, Tooltip, ZoomButtonRow } from "~/components"
import { createLazyComponent, useBodyToggableClass } from "~/hooks"

const nav__buttonNotInReducedMode = css`
  opacity: 0.2;
`

const nav__buttonInReducedMode = css`
  opacity: 0;
`

const nav__button = css`
  height: 33%;
  padding: 10px;
  position: absolute;
  z-index: 5;
  top: 50%;
  transform: translate(0, -50%);
  color: var(--overlay1);
  &:not(:disabled):hover {
    opacity: 1;
    color: var(--text);
  }

  &:not(:disabled):hover > div {
    background-color: var(--base);
  }
`

const nav__leftButton = css`
  left: 0;
  padding-left: 10px;
  padding-right: 15px;
`

const nav__rightButton = css`
  right: 0;
  padding-left: 15px;
  padding-right: 10px;
`

const nav__titleBar = css`
  position: fixed;
  padding-top: 10px;
  padding-inline: 25px;
  height: auto !important;
  gap: 10px;
`

const nav__titleBarHidden = css`
  opacity: 0;
`

const nav__buttonIconWrapper = css`
  padding: 5px;
  border-radius: 6px;
`

const nav__currentItem = css`
  padding-inline: 10px;
  padding-block: 4px;
  border-radius: 6px;
  background-color: var(--base);
`

export function GalleryNav() {
  const { goToNextItem$, goToPrevItem$, shouldDisableNextBtn$, shouldDisablePrevBtn$, allControlsHidden$, currentItem$, currentItemIndex$, entries$ } = useGalleryContext()
  const redirect = useNavigate()

  const toggleClass = useBodyToggableClass("galleryPage__reducedMode")

  createEffect(() => {
    toggleClass(allControlsHidden$())
  })

  const GalleryCurrentItemInfoDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("../components/dialog/GalleryCurrentItemInfoDialog"),
    () => ({
      currentItemIndex$: currentItemIndex$(),
      currentItem$: currentItem$()!,
      totalItems$: entries$().length,
    })
  )

  return (
    <>
      <AppTitleBarDraggable class={`${nav__titleBar} ${allControlsHidden$() ? nav__titleBarHidden : ''}`}>
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={() => redirect("/")}
        >
          <BsArrowLeft size={16} />
        </Button>
        <Show when={currentItem$()?.type !== 1}>
          <ZoomButtonRow />
        </Show>
        <div class={nav__currentItem}>
          {currentItemIndex$() + 1} / {entries$().length}
        </div>
        <Tooltip label$="View information">
          <Button 
            size$={ButtonSize.ICON_LARGE} 
            variant$={ButtonVariant.NO_BACKGROUND} 
            onClick={GalleryCurrentItemInfoDialog.show$}
          >
            <BsInfoCircleFill size={16} />
          </Button>
        </Tooltip>
      </AppTitleBarDraggable>
      <button 
        class={`${nav__button} ${nav__leftButton} ${allControlsHidden$() ? nav__buttonInReducedMode : nav__buttonNotInReducedMode}`} 
        disabled={shouldDisablePrevBtn$()} 
        onClick={goToPrevItem$}
      >
        <Tooltip label$={(
          <>
            <div>Go to previous item</div>
            <Kbd>A</Kbd>
          </>
        )} tooltipOptions$={{
          placement: "right"
        }}>
          <div class={nav__buttonIconWrapper}>
            <BsCaretLeftFill size={25} />
          </div>
        </Tooltip>
      </button>
      <button 
        class={`${nav__button} ${nav__rightButton} ${allControlsHidden$() ? nav__buttonInReducedMode : nav__buttonNotInReducedMode}`} 
        disabled={shouldDisableNextBtn$()} 
        onClick={goToNextItem$}
      >
        <Tooltip label$={(
          <>
            <div>Go to next item</div>
            <Kbd>D</Kbd>
          </>
        )} tooltipOptions$={{
          placement: "left"
        }}>
          <div class={nav__buttonIconWrapper}>
            <BsCaretRightFill size={25} />
          </div>
        </Tooltip>
      </button>

      <GalleryCurrentItemInfoDialog.Component$ />
    </>
  )
}