import { type ParentProps } from "solid-js"
import { TbFillZoomCancel, TbFillZoomIn, TbFillZoomOut } from 'solid-icons/tb'
// ...
import { css } from "molcss"
// ...
import { Button, Tooltip } from "~/components"
// ...
import { useZoomAndPanContext } from "./ZoomAndPanProvider"

const buttonRow__root = css`
  gap: 5px;
  user-select: none;
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  align-items: center;
`

const buttonRow__scaleText = css`
  min-width: 3rem;
  background-color: var(--base);
  padding-inline: 5px;
  padding-block: 4px;
  border-radius: 6px;
  text-align: center;
`

export function ZoomButtonRow(props: ParentProps) {
  const { unzoom$, zoom$, reset$, internal$ } = useZoomAndPanContext()

  return (
    <div class={buttonRow__root}>
      <Tooltip label$="Reset to default zoom">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={reset$} 
          disabled={internal$.zoomScale$() === 1}
        >
          <TbFillZoomCancel size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom out">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
          variant$={ButtonVariant.NO_BACKGROUND} 
          onClick={unzoom$} 
          disabled={internal$.zoomScale$() === 0}
        >
          <TbFillZoomOut size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom in">
        <Button 
          size$={ButtonSize.ICON_LARGE} 
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