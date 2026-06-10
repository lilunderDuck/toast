import { css } from "molcss"
import { BsArrowLeft, BsCaretLeftFill, BsCaretRightFill } from "solid-icons/bs"
import { useGalleryContext } from "../provider"
import { AppTitleBarDraggable, Button, ZoomButtonRow } from "~/components"
import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"

const nav__button = css`
  height: 100%;
  position: absolute;
  z-index: 5;
  opacity: 0.2;
  &:hover {
    opacity: 1;
  }
`

const nav__leftButton = css`
  left: 0;
  padding-left: 10px;
  padding-right: 20px;
`

const nav__rightButton = css`
  right: 0;
  padding-left: 20px;
  padding-right: 10px;
`

const nav__titleBar = css`
  position: fixed;
  padding-top: 5px;
  padding-left: 10px;
  height: auto !important;
  gap: 10px;
`

const nav__goBackToHomeButton = css`
`

export function GalleryNav() {
  const { goToNextItem$, goToPrevItem$, shouldDisableNextBtn$, shouldDisablePrevBtn$, allControlsHidden$ } = useGalleryContext()
  const redirect = useNavigate()

  return (
    <>
      <AppTitleBarDraggable class={nav__titleBar}>
        <Button size$={ButtonSize.ICON} class={nav__goBackToHomeButton} onClick={() => redirect("/")}>
          <BsArrowLeft size={16} />
        </Button>
        <Show when={!allControlsHidden$()}>
          <ZoomButtonRow />
        </Show>
      </AppTitleBarDraggable>
      <Show when={!allControlsHidden$()}>
        <button 
          class={`${nav__button} ${nav__leftButton}`}
          disabled={shouldDisablePrevBtn$()}
          onClick={goToPrevItem$}
        >
          <BsCaretLeftFill size={30} />
        </button>
        <button 
          class={`${nav__button} ${nav__rightButton}`}
          disabled={shouldDisableNextBtn$()}
          onClick={goToNextItem$}
        >
          <BsCaretRightFill size={30} />
        </button>
      </Show>
    </>
  )
}