import { Match, Switch } from "solid-js"
import { TbZoomReset, TbZoomIn, TbZoomOut } from 'solid-icons/tb'
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useZoomAndPanContext } from "./ZoomAndPanProvider"


const style = stylex.create({
  wholeThing: {
    gap: 10,
    userSelect: "none",
    paddingInline: 10,
    paddingBlock: 5
  },
  scaleText: {
    minWidth: '3rem'
  },
  highlightZoomButtonRow: {
    backgroundColor: 'var(--gray1)',
    borderRadius: 6,
    opacity: 0.4,
    transition: "0.1s ease-out",
    ":hover": {
      opacity: 1
    }
  }
})

export function ZoomButtonRow() {
  const { unzoom$, zoom$, reset$, internal$ } = useZoomAndPanContext()

  return (
    <FlexCenterY 
      {...stylex.attrs(
        style.wholeThing, 
        internal$.zoomScale$() > 1 ? style.highlightZoomButtonRow : {}
      )}
    >
      <Tooltip label$="Reset to default zoom">
        <Button size$={ButtonSizeVariant.icon} onClick={reset$} disabled={internal$.zoomScale$() === 1}>
          <TbZoomReset size={16} />
        </Button>
      </Tooltip>
      <div />
      <Tooltip label$="Zoom out">
        <Button size$={ButtonSizeVariant.icon} onClick={unzoom$} disabled={internal$.zoomScale$() === 0}>
          <TbZoomOut size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom in">
        <Button size$={ButtonSizeVariant.icon} onClick={zoom$}>
          <TbZoomIn size={16} />
        </Button>
      </Tooltip>
      <span {...stylex.attrs(style.scaleText)}>
        <Switch fallback={
          <>{internal$.zoomScale$()}x</>
        }>
          <Match when={internal$.zoomScale$() >= 5}>
            Absurdly large ({internal$.zoomScale$()}x)
          </Match>
          <Match when={internal$.zoomScale$() == 0}>
            *Vanished*
          </Match>
        </Switch>
      </span>
    </FlexCenterY>
  )
}