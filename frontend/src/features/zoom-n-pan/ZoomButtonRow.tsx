import { Button, ButtonSizeVariant, FlexCenterY } from "~/components"
import { useZoomAndPanContext } from "./ZoomAndPanProvider"
import { Match, Switch } from "solid-js"

import stylex from "@stylexjs/stylex"
import { BsDash, BsPlus } from "solid-icons/bs"

const style = stylex.create({
  wholeThing: {
    gap: 10
  },
  scaleText: {
    minWidth: '3rem'
  }
})

export function ZoomButtonRow() {
  const { unzoom$, zoom$, internal$ } = useZoomAndPanContext()

  return (
    <FlexCenterY {...stylex.attrs(style.wholeThing)}>
      <Button size$={ButtonSizeVariant.icon} onClick={unzoom$}>
        <BsDash />
      </Button>
      <Button size$={ButtonSizeVariant.icon} onClick={zoom$}>
        <BsPlus />
      </Button>
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