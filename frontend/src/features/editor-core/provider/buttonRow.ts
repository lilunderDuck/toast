import { Accessor, createSignal } from "solid-js"
// ...

export interface IButtonRowUtils {
  updatePosition$(blockRef: HTMLDivElement): void
  currentButtonRowYPos$: Accessor<{
    x: number,
    y: number
  }>
}

export function createButtonRow() {
  const [currentButtonRowYPos, setCurrentButtonRowYPos] = createSignal({
    x: 0,
    y: 0
  })

  const updatePosition: IButtonRowUtils["updatePosition$"] = (blockRef) => {
    const boundRect = blockRef.getBoundingClientRect()
    setCurrentButtonRowYPos({
      x: boundRect.x,
      y: boundRect.y
    })
  }

  return {
    updatePosition$: updatePosition,
    currentButtonRowYPos$: currentButtonRowYPos
  }
}