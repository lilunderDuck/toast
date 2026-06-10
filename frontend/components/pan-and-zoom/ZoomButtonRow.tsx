import { type ParentProps } from "solid-js"
import { TbFillZoomCancel, TbFillZoomIn, TbFillZoomOut } from 'solid-icons/tb'
// ...
import { Button, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useZoomAndPanContext } from "./ZoomAndPanProvider"

const style = stylex.create({
  wholeThing: {
    gap: 10,
    userSelect: "none",
    paddingInline: 10,
    paddingBlock: 5,
    display: "flex",
    alignItems: 'center',
  },
  scaleText: {
    minWidth: '3rem',
    backgroundColor: "var(--base)",
    paddingInline: 5,
    paddingBlock: 4,
    borderRadius: 6,
    textAlign: "center"
  },
})

export function ZoomButtonRow(props: ParentProps) {
  const { unzoom$, zoom$, reset$, internal$ } = useZoomAndPanContext()

  return (
    <div {...stylex.attrs(style.wholeThing)}>
      <Tooltip label$="Reset to default zoom">
        <Button size$={ButtonSize.ICON} onClick={reset$} disabled={internal$.zoomScale$() === 1}>
          <TbFillZoomCancel size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom out">
        <Button size$={ButtonSize.ICON} onClick={unzoom$} disabled={internal$.zoomScale$() === 0}>
          <TbFillZoomOut size={16} />
        </Button>
      </Tooltip>
      <Tooltip label$="Zoom in">
        <Button size$={ButtonSize.ICON} onClick={zoom$}>
          <TbFillZoomIn size={16} />
        </Button>
      </Tooltip>
      <span {...stylex.attrs(style.scaleText)}>
        {internal$.zoomScale$()}x
      </span>
      {props.children}
    </div>
  )
}