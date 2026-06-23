import { BsArrowLeft, BsCaretLeftFill, BsCaretRightFill, BsInfoCircleFill } from "solid-icons/bs"
import { useNavigate } from "@solidjs/router"
import { createEffect, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./GalleryNav.css"
// ...
import { useGalleryContext } from "../provider"
// ...
import { AppTitleBarDraggable, Button, Tooltip, ZoomButtonRow } from "~/components"
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
  &:hover {
    opacity: 1;
    color: var(--text);
  }

  &:hover > div {
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
  padding-top: 5px;
  padding-left: 10px;
  height: auto !important;
  gap: 10px;
  transition: 0.15s ease-out;
`

const nav__titleBarHidden = css`
  opacity: 0;
`

const nav__buttonIconWrapper = css`
  padding: 5px;
  border-radius: 6px;
  transition: 0.15s ease-out;
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
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={() => redirect("/")}
        >
          <BsArrowLeft size={16} />
        </Button>
        <Show when={currentItem$()?.type !== 1}>
          <ZoomButtonRow />
        </Show>
        <Tooltip label$="View information">
          <Button 
            size$={ButtonSize.ICON} 
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
        <div class={nav__buttonIconWrapper}>
          <BsCaretLeftFill size={25} />
        </div>
      </button>
      <button 
        class={`${nav__button} ${nav__rightButton} ${allControlsHidden$() ? nav__buttonInReducedMode : nav__buttonNotInReducedMode}`} 
        disabled={shouldDisableNextBtn$()} 
        onClick={goToNextItem$}
      >
        <div class={nav__buttonIconWrapper}>
          <BsCaretRightFill size={25} />
        </div>
      </button>

      <GalleryCurrentItemInfoDialog.Component$ />
    </>
  )
}