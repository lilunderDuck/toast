import { type ParentProps } from "solid-js"
import { TbFillZoomCancel, TbFillZoomIn, TbFillZoomOut } from 'solid-icons/tb'
// ...
import { Button, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useZoomAndPanContext } from "./ZoomAndPanProvider"
import { css } from "molcss"

const buttonRow__root = css`
  gap: 10px;
  user-select: none;
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  align-items: center;
`

const buttonRow__scaleText = css`
  min-width: 3rem;
  background-color: var(--base);
  padding-inline: 5;
  padding-block: 4;
  border-radius: 6;
  text-align: center;
`

export function ZoomButtonRow(props: ParentProps) {
  const { unzoom$, zoom$, reset$, internal$ } = useZoomAndPanContext()

  return (
    <div class={buttonRow__root}>
      <Tooltip label$="Reset to default zoom">
        <Button 
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={reset$} 
          disabled={internal$.zoomScale$() === 1}
        >
          <TbFillZoomCancel size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom out">
        <Button 
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={unzoom$} 
          disabled={internal$.zoomScale$() === 0}
        >
          <TbFillZoomOut size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom in">
        <Button 
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={zoom$}
        >
          <TbFillZoomIn size={16} />
        </Button>
      </Tooltip>
      <span class={buttonRow__scaleText}>
        {internal$.zoomScale$()}x
      </span>
      {props.children}
    </div>
  )
}