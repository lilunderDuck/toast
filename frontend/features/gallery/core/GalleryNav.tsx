import { css } from "molcss"
import { BsArrowLeft, BsCaretLeftFill, BsCaretRightFill } from "solid-icons/bs"
import { useGalleryContext } from "../provider"
import { AppTitleBarDraggable, Button, ZoomButtonRow } from "~/components"
import { useNavigate } from "@solidjs/router"
import { createEffect, Show } from "solid-js"
import "./GalleryNav.css"
import { useBodyClass, useBodyToggableClass } from "~/hooks"

const nav__buttonNotInReducedMode = css`
  opacity: 0.2;
`

const nav__buttonInReducedMode = css`
  opacity: 0;
`

const nav__button = css`
  height: 15rem;
  padding: 10px;
  position: absolute;
  z-index: 5;
  top: 50%;
  transform: translate(0, -50%);
  &:hover {
    opacity: 1;
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

const nav__goBackToHomeButton = css`
`

export function GalleryNav() {
  const { goToNextItem$, goToPrevItem$, shouldDisableNextBtn$, shouldDisablePrevBtn$, allControlsHidden$, currentItem$ } = useGalleryContext()
  const redirect = useNavigate()

  const toggleClass = useBodyToggableClass("galleryPage__reducedMode")

  createEffect(() => {
    toggleClass(allControlsHidden$())
  })

  return (
    <>
      <AppTitleBarDraggable class={`${nav__titleBar} ${allControlsHidden$() ? nav__titleBarHidden : ''}`}>
        <Button size$={ButtonSize.ICON} variant$={ButtonVariant.NO_BACKGROUND} class={nav__goBackToHomeButton} onClick={() => redirect("/")}>
          <BsArrowLeft size={16} />
        </Button>
        <Show when={currentItem$()?.type !== 1}>
          <Show when={!allControlsHidden$()}>
            <ZoomButtonRow />
          </Show>
        </Show>
      </AppTitleBarDraggable>
      <button class={`${nav__button} ${nav__leftButton} ${allControlsHidden$() ? nav__buttonInReducedMode : nav__buttonNotInReducedMode}`} disabled={shouldDisablePrevBtn$()} onClick={goToPrevItem$}>
        <BsCaretLeftFill size={30} />
      </button>
      <button class={`${nav__button} ${nav__rightButton} ${allControlsHidden$() ? nav__buttonInReducedMode : nav__buttonNotInReducedMode}`} disabled={shouldDisableNextBtn$()} onClick={goToNextItem$}>
        <BsCaretRightFill size={30} />
      </button>
    </>
  )
}