import stylex from "@stylexjs/stylex"
import __style from "../ImageInput.module.css"
import { mergeClassname } from "~/utils"
import { Button, ButtonSizeVariant, createLazyLoadedDialog, Tooltip } from "~/components"
import { BsFullscreen } from "solid-icons/bs"
import { lazy } from "solid-js"

const style = stylex.create({
  displayOnTop: {
    position: 'absolute',
    top: 0,
  },
  input: {
    gap: 10
  },
  fullScreenButton: {
    right: 0,
    paddingTop: 5,
    paddingRight: 5
  }
})

interface IFullViewButtonProps {
  imageSrc$: string
}

export function FullViewButton(props: IFullViewButtonProps) {
  const imageFullviewDialog = createLazyLoadedDialog(
    lazy(() => import("./ImageFullviewDialog")),
    () => ({
      imageSrc$: props.imageSrc$
    })
  )

  return (
    <div class={mergeClassname(
      stylex.attrs(style.displayOnTop, style.fullScreenButton),
      __style.fullScreenButton
    )}>
      <Tooltip label$="Open in full view">
        <Button size$={ButtonSizeVariant.icon} onClick={() => {
          imageFullviewDialog.show$()
          console.log('clicked')
        }}>
          <BsFullscreen />
        </Button>
      </Tooltip>
      <imageFullviewDialog.Modal$ />
    </div>
  )
}