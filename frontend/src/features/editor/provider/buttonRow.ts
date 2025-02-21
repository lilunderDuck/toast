import { type Accessor, createSignal } from "solid-js"
import type { EditorSessionStorage } from "./EditorProvider"
// ...

export interface IButtonRowUtils {
  updatePosition$(blockRef: HTMLDivElement): void
  currentButtonRowYPos$: Accessor<{
    x: number,
    y: number
  }>
}

export function createButtonRow(wrappedSessionStorage: EditorSessionStorage) {
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

    wrappedSessionStorage.set$('currentBlock', parseInt(blockRef.dataset!.id ?? ''))
  }

  return {
    updatePosition$: updatePosition,
    currentButtonRowYPos$: currentButtonRowYPos
  }
}