import { type Accessor, createSignal } from "solid-js"
import type { EditorSessionStorage } from "./EditorProvider"
// ...

export interface IButtonRowUtils {
  /**Updates the position of the button row and also set `"currentBlock"` to `sessionStorage` to...
   * make some basic editor editing functionality works.
   * @param blockRef A reference to the block element.
   * @returns *nothing*
   */
  updatePosition$(blockRef: HTMLDivElement): void
  /**An accessor for the current position of the button row. */
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